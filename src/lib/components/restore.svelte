<script lang="ts">
	async function fetchFileContent(file: File): Promise<string | ArrayBuffer | null> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.onload = function (e) {
				// @ts-ignore
				const contents = e.target.result
				resolve(contents)
			}
			reader.onerror = function (e) {
				reject(e)
			}
			reader.readAsText(file)
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

		let fileContent: string | ArrayBuffer | null = await fetchFileContent(file)

		console.log(`printing content of "${file.name}":\n`, fileContent)
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
