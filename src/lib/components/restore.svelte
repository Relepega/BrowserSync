<script lang="ts">
	import type { FullBackup } from '$lib/types/types'
	import { decrypt } from '$lib/logic/en-decrypt'

	let isEncrypted: boolean = false

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

	async function handleFileChange(event: Event) {
		// @ts-ignore
		const evtTgt: HTMLInputElement = event.target
		// @ts-ignore
		const file: File | null = evtTgt.files[0]

		if (!file) {
			return
		}

		const fileContent: ArrayBuffer = await fetchFileContent(file)

		let backupData: FullBackup = {}

		try {
			const decoder = new TextDecoder()
			backupData = JSON.parse(decoder.decode(fileContent))
		} catch (error) {
			isEncrypted = true
		}

		if (isEncrypted) {
			try {
				backupData = JSON.parse(await decrypt(new Uint8Array(fileContent), 'asdf'))
			} catch (error) {
				console.error(error)
			}
		}

		console.log(backupData)
	}
</script>

<div id="file-choser">
	<h4>Chose a backup file</h4>
	<input
		type="file"
		name="backup-file"
		id="backup-file"
		accept=".bsbak"
		on:change={handleFileChange}
	/>
</div>
