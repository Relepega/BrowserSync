<script lang="ts">
	let alert: HTMLElement

	$: msg = ''

	export function openAlert(message: string = '') {
		alert.style.display = 'flex'
		msg = message
	}

	export function closeAlert() {
		alert.style.display = 'none'
	}
</script>

<div id="alert" bind:this={alert}>
	<div class="modal">
		<p>{msg}</p>
		<div class="btn-row">
			<div class="btn" on:click={() => closeAlert()}>ok</div>
		</div>
	</div>
</div>

<style>
	#alert {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		display: none;
		justify-content: center;
		align-items: center;

		background-color: rgba(0, 0, 0, 0.6);

		z-index: 20;
	}

	.modal {
		transform: translateY(50%);
		width: fit-content;
		height: fit-content;
		z-index: 21;

		background-color: whitesmoke;
		min-width: 250px;
		padding: 20px;
	}

	p {
		text-align: center;
	}

	.btn-row {
		display: flex;
		justify-content: center;
	}

	.btn {
		background-color: lightcoral;
		cursor: pointer;
		padding: 5px 10px;
		width: fit-content;
		margin-top: 20px;
	}
</style>
