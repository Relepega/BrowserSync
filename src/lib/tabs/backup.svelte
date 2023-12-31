<script lang="ts">
	import type { FullBackup } from '$lib/types/types'

	import PassphraseInput from '$lib/components/passphraseInput.svelte'
	import Alert from '$lib/components/alert.svelte'

	import { getOpenTabs, getTabGroups, getBookmarks, getExtensions } from '$lib/logic/backup'
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
			alert.openAlert('Impossible to create a backup file of nothing!')
			return
		}

		const data = JSON.stringify(await create())
		// const data = '{"extensions": [{"id": "test", name: "test data"}]}'

		if (useEncryption) {
			if (!passphraseInputValue) {
				alert.openAlert('Cannot use an empty string as passphrase!')
				return
			}

			const encData: Uint8Array = await encrypt(data, passphraseInputValue)
			await download(encData.buffer)
		} else {
			// console.log(data)
			const encoder = new TextEncoder()
			await download(encoder.encode(data))
		}
	}

	async function download(data: ArrayBuffer) {
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
</script>

<Alert bind:this={alert} />

<h4>What do you want to backup?</h4>

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
	<PassphraseInput msg="Enter a passhprase:" bind:passphraseInput bind:passphraseInputValue />
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
</style>
