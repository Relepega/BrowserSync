<script lang="ts">
	import { getOpenTabs, getTabGroups, getBookmarks, getExtensions } from '$lib/logic/backup'
	import type { FullBackup } from '$lib/types/types'
	import Alert from '$lib/components/alert.svelte'
	import { encrypt } from '$lib/logic/en-decrypt'

	let alert: Alert

	let tabs: boolean = true
	let bookmarks: boolean = true
	let extensions: boolean = false

	let useEncryption: boolean = false
	let passphraseInput: HTMLElement
	let passphraseInputValue: string

	let localBackup: boolean
	let cloudBackup: boolean

	async function create(): Promise<FullBackup> {
		const backup: FullBackup = {}

		if (tabs) {
			backup.tabs = await getOpenTabs()
			backup.tabGroups = await getTabGroups()
		}

		if (bookmarks) {
			backup.bookmarks = await getBookmarks()
		}

		if (extensions) {
			backup.extensions = await getExtensions()
		}

		return backup
	}

	async function prepareDownload() {
		if (!tabs && !bookmarks && !extensions) {
			alert.openAlert('suca coglione')
			return
		}

		const data = JSON.stringify(await create())

		if (useEncryption) {
			console.log(passphraseInputValue)

			if (!passphraseInputValue) {
				alert.openAlert('suca coglione')
				return
			}

			const encData: Uint8Array = await encrypt(data, passphraseInputValue)
			await download(encData.toString())
		} else {
			// console.log(data)
			await download(data)
		}
	}

	async function download(data: string) {
		const blob = new Blob([data], { type: 'application/bsbak' })

		const d = new Date()
		const day = String(d.getDate()).padStart(2, '0')
		const month = String(d.getMonth() + 1).padStart(2, '0')
		const year = d.getFullYear()
		const hours = String(d.getHours() + 1).padStart(2, '0')
		const minutes = String(d.getMinutes() + 1).padStart(2, '0')
		const seconds = String(d.getSeconds()).padStart(2, '0')
		const mseconds = String(d.getMilliseconds()).padStart(3, '0')

		await chrome.downloads.download({
			url: URL.createObjectURL(blob),
			filename: `backup-${year}+${month}+${day}+${hours}+${minutes}+${seconds}+${mseconds}.bsbak`
		})
	}

	function seePwd() {
		if (passphraseInput.getAttribute('type') === 'password') {
			passphraseInput.setAttribute('type', 'text')
		} else {
			passphraseInput.setAttribute('type', 'password')
		}
	}
</script>

<Alert bind:this={alert} />

<h3>What do you want to backup?</h3>

<div id="items">
	<label>
		<input type="checkbox" name="items" id="item-tabs" bind:checked={tabs} />
		Open tabs
	</label>
	<label>
		<input type="checkbox" name="items" id="item-bookmarks" bind:checked={bookmarks} />
		Bookmarks
	</label>
	<label>
		<input type="checkbox" name="items" id="item-extensions" bind:checked={extensions} />
		Extensions
	</label>
</div>

<!--
	TODO

<hr />

<h3>Where do you want to save the backup?</h3>

<div id="location">
	<label>
		<input type="checkbox" name="items" id="location-local" bind:checked={localBackup} />
		On your computer
	</label>
	<label>
		<input type="checkbox" name="items" id="location-cloud" bind:checked={cloudBackup} />
		On the cloud
	</label>
</div>
-->

<hr />

<label>
	<input type="checkbox" name="encrypt" id="encrypt" bind:checked={useEncryption} />
	Encrypt it?
</label>

{#if useEncryption}
	<div id="encrypt">
		<label>
			Enter a passhprase:
			<input
				type="password"
				name="passphrase"
				id="passphrase"
				bind:this={passphraseInput}
				bind:value={passphraseInputValue}
			/>
			<div on:click={() => seePwd()}>👁️‍🗨️</div>
		</label>
	</div>
{/if}

<hr />

<div id="download" on:click={() => prepareDownload()}>Download</div>

<style lang="scss">
	h3 {
		text-align: center;
	}

	#items/*,
	#location*/ {
		display: flex;
		justify-content: space-between;
	}

	hr {
		margin: 20px 0;
	}

	#download {
		cursor: pointer !important;

		background-color: lightcoral;
		width: fit-content;

		padding: 5px 10px;
		margin-top: 20px;

		&:hover {
			background-color: rgb(202, 71, 71);
			color: white;
		}
	}

	#encrypt label {
		margin-top: 20px;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;

		input {
			// input-security: auto;

			width: 155px;

			outline: none;
			// outline-color: rgb(152, 229, 255);
			appearance: none;
			border: none;

			line-height: 1.5rem;
			background-color: rgba(216, 216, 216, 0.192);
			border-bottom: 2px solid rgb(145, 145, 145);

			&:focus {
				border-bottom-color: rgb(70, 70, 70);
			}
		}

		div {
			font-size: larger;
		}
	}
</style>
