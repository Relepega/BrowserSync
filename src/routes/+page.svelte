<script lang="ts">
	import Backup from '$lib/tabs/backup.svelte'
	import Restore from '$lib/tabs/restore.svelte'

	let mode: string = 'restore'

	function setMode(m: string) {
		mode = m
	}
</script>

<h1>BrowserSync Reloaded</h1>

<div class="container">
	<div class="tab-name">
		<div
			on:click={() => {
				mode = 'backup'
			}}
		>
			Backup
		</div>
		<div
			on:click={() => {
				mode = 'restore'
			}}
		>
			Restore
		</div>
	</div>
	<div class="tab-content">
		{#if mode == 'backup'}
			<Backup />
		{:else}
			<Restore />
		{/if}
	</div>
</div>

<style lang="scss">
	$tab-name-height: 35px;

	h1 {
		text-align: center;
	}

	.container {
		display: flex;
		flex-direction: column;
	}

	.tab-name {
		display: flex;
		flex-grow: 1;

		div {
			border: 1px solid grey;
			flex-grow: 1;
			height: $tab-name-height;

			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.tab-content {
		border: 1px solid grey;
		padding: 0 20px 20px 20px;
	}
</style>
