<script lang="ts">
	import Backup from '$lib/components/backup.svelte'
	import Restore from '$lib/components/restore.svelte'

	let mode: string = 'backup'
</script>

<h1>BrowserSync Reloaded</h1>

<div class="tab-name">
	<div>
		<input type="radio" name="mode" value="backup" id="mode-backup" bind:group={mode} />
		<label for="mode-backup">Backup</label>
	</div>
	<div>
		<input type="radio" name="mode" value="restore" id="mode-restore" bind:group={mode} />
		<label for="mode-restore">Restore</label>
	</div>
</div>
<div class="tab-content">
	{#if mode == 'backup'}
		<Backup />
	{:else}
		<Restore />
	{/if}
</div>

<style lang="scss">
	$tab-name-height: 35px;

	h1 {
		text-align: center;
	}

	.tab-name {
		display: flex;

		div {
			border: 1px solid grey;
			width: 50%;
			height: $tab-name-height;

			display: flex;
			justify-content: center;
			align-items: center;

			input[type='radio'],
			&:checked {
				padding: 0;
				margin: 0;
				position: fixed;
				opacity: 0;
				pointer-events: none;
				visibility: hidden;

				width: 25%;
				height: $tab-name-height;
			}
		}
	}

	.tab-content {
		border: 1px solid grey;
		padding: 0 20px 20px 20px;
	}
</style>
