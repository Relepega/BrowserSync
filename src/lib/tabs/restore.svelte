<script lang="ts">
	import type { FullBackup } from '$lib/types/types'

	import { decrypt } from '$lib/logic/en-decrypt'
	import { restore } from '$lib/logic/restore'

	import PassphraseInput from '$lib/components/passphraseInput.svelte'

	type Logger = {
		isError: boolean
		message: string | String
	}

	let tabs: boolean = false
	let bookmarks: boolean = false
	let extensions: boolean = false

	let isEncrypted: boolean = false
	let passphraseInput: HTMLElement
	let passphraseInputValue: string

	let backupLoadingLogger: Logger = {
		isError: false,
		message: ''
	}

	let fileContent: ArrayBuffer
	let backupData: FullBackup = {}

	let canRestore: boolean = false

	let restoreStatusNode: HTMLElement

	async function fetchFileContent(file: File): Promise<ArrayBuffer> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()

			reader.onload = function (e) {
				// @ts-ignore
				const contents = e.target.result

				if (!contents) {
					reject('Empty file')
				}

				// @ts-ignore
				resolve(contents)
			}

			reader.onerror = function (e) {
				reject(e)
			}

			reader.readAsArrayBuffer(file)
		})
	}

	function setRestoreDefaults() {
		backupData.tabs ? (tabs = true) : (tabs = false)
		backupData.bookmarks ? (bookmarks = true) : (bookmarks = false)
		backupData.extensions ? (extensions = true) : (extensions = false)
	}

	async function handleFileChange(event: Event) {
		backupLoadingLogger = {
			isError: false,
			message: ''
		}

		canRestore = false

		// @ts-ignore
		const evtTgt: HTMLInputElement = event.target
		// @ts-ignore
		const file: File | null = evtTgt.files[0]

		if (!file) {
			return
		}

		fileContent = await fetchFileContent(file)

		try {
			const decoder = new TextDecoder()
			backupData = JSON.parse(decoder.decode(fileContent))
			setRestoreDefaults()
			backupLoadingLogger.message = 'Backup content loaded successfully!'
			canRestore = true
		} catch (error) {
			isEncrypted = true
		}
	}

	async function decryptData() {
		let data = {}

		backupLoadingLogger = {
			isError: false,
			message: ''
		}

		try {
			backupData = JSON.parse(
				await decrypt(new Uint8Array(fileContent), passphraseInputValue)
			)
			setRestoreDefaults()
			backupLoadingLogger.message = 'Backup content decrypted successfully!'
			canRestore = true
		} catch (e: any) {
			const err: String = new String(e)

			backupLoadingLogger.isError = true

			if (err.startsWith('SyntaxError')) {
				backupLoadingLogger.message = 'Incorrect decryption key'
			} else {
				backupLoadingLogger.message = 'Unknown error'
			}
		}
	}
</script>

<div id="file-choser">
	<h4>Choose a backup file</h4>
	<input
		type="file"
		name="backup-file"
		id="backup-file"
		accept=".bsbak"
		on:change={handleFileChange}
	/>
</div>

{#if isEncrypted}
	<hr />
	<PassphraseInput
		msg="Enter the decryption key:"
		bind:passphraseInput
		bind:passphraseInputValue
	/>
	<button on:click={() => decryptData()}>Decrypt</button>
{/if}

{#if backupLoadingLogger.message}
	<p id="logger" class="logger-{backupLoadingLogger.isError ? 'error' : 'info'}">
		{backupLoadingLogger.message}
	</p>
{/if}

{#if canRestore}
	<hr />
	<p>Which items do you want to restore?</p>
	<div id="items">
		{#if backupData.tabs}
			<label>
				<input type="checkbox" name="items" id="item-tabs" bind:checked={tabs} />
				Tabs & groups
			</label>
		{/if}
		{#if backupData.bookmarks}
			<label>
				<input type="checkbox" name="items" id="item-bookmarks" bind:checked={bookmarks} />
				Bookmarks
			</label>
		{/if}
		{#if backupData.extensions}
			<label>
				<input
					type="checkbox"
					name="items"
					id="item-extensions"
					bind:checked={extensions}
				/>
				Extensions
			</label>
		{/if}
	</div>
	<p>PLEASE DO NOT CLOSE THE EXTENSION OR ELSE THE RESTORING PROCESS WILL STOP!</p>
	<button
		on:click={() => {
			restore(backupData, restoreStatusNode)
		}}>Restore</button
	>
	<p bind:this={restoreStatusNode}>The status about restoring your data will be shown here...</p>
{/if}

<style>
	#items {
		display: flex;
		justify-content: space-between;
	}

	.logger-error {
		color: red;
	}

	.logger-info {
		color: green;
	}
</style>
