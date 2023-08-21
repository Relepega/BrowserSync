<script lang="ts">
	export let msg: string
	export let passphraseInput: HTMLElement
	export let passphraseInputValue: string

	function seePwd() {
		if (passphraseInput.getAttribute('type') === 'password') {
			passphraseInput.setAttribute('type', 'text')
		} else {
			passphraseInput.setAttribute('type', 'password')
		}
	}
</script>

<label>
	{msg}
	<input
		type="password"
		name="passphrase"
		class="passphrase-input"
		bind:this={passphraseInput}
		bind:value={passphraseInputValue}
	/>
	<div on:click={() => seePwd()}>👁️‍🗨️</div>
</label>

<style lang="scss">
	label {
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
