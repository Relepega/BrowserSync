<script lang="ts">
	let backupFile: string = ''
</script>

<div id="file-choser">
	<h4>Chose a backup file</h4>
	<input
		type="file"
		name="backup-file"
		id="backup-file"
		accept=".bsbak"
		bind:value={backupFile}
	/>
</div>

{backupFile}
