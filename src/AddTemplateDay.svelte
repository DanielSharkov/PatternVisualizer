<script lang='ts'>
import {createEventDispatcher} from 'svelte'
const dispatch = createEventDispatcher<{
	close: void
	addGap: void
	addEntry: string
}>()

export let open
let color = randHexColor()

export function randHexColor() {
	let arr = new Uint8Array(3)
	window.crypto.getRandomValues(arr)
	return '#' + Array.from(
		arr, (dec)=> dec.toString(16).padStart(2, '0'),
	).join('')
}

function close() {
	open = false
}
function addEntry() {
	dispatch('addEntry', color)
	close()
	color = randHexColor()
}
function addGap() {
	dispatch('addGap')
	close()
}
</script>

{#if open}
	<div class='modal-container'>
		<div class='modal'>
			<div class='header'>
				<h1>Add template entry</h1>
				<button on:click={close} class='close-modal'>
					<svg class='icon' viewBox='0 0 10 10' fill='none' xmlns='http://www.w3.org/2000/svg'>
						<path stroke='currentColor' stroke-width='0.3' d='m1 9 4-4m0 0 4-4M5 5l4 4M5 5 1 1'/>
					</svg>
				</button>
			</div>

			<button on:click={addGap}>
				Add as gap
			</button>

			<div class='or-separator'>
				<span class='fill'/><span>OR</span><span class='fill'/>
			</div>

			<div class='add-day-wrapper'>
				<button on:click={()=> {color = randHexColor()}}>
					Random color
				</button>
				<div class='color-picker'>
					<div style:background-color={color}/>
					<input type='color' bind:value={color}/>
				</div>
				<button on:click={addEntry} class='add-day'>
					Add
				</button>
			</div>
		</div>
	</div>
{/if}

<style lang='stylus'>
.modal-container
	z-index: 50
	position: fixed
	top: 0
	left: 0
	display: flex
	height: 100%
	width: 100%
	flex-flow: row nowrap
	justify-content: center
	align-content: flex-start
	align-items: center
	background-color: var(--overlay-bg)
	box-sizing: border-box
	> .modal
		display: grid
		padding: 1.5rem
		width: 100%
		max-width: 450px
		min-width: 450px
		grid-gap: 1rem
		background-color: var(--page-bg)
		box-shadow: var(--modal-shadow)
		border: solid 1px var(--font)
		box-sizing: border-box

.header
	display: flex
	flex-flow: row wrap
	justify-content: center
	align-items: center
	> .close-modal
		display: flex
		justify-content: center
		align-items: center
		margin-left: auto
		padding: 0.25rem
		> .icon
			width: 1.25rem
			height: 1.25rem
	> h1
		margin: 0
		font-size: 1.25rem
		font-weight: 500

button
	background-color: rgba(#000, 0.05)
	border: solid 1px rgba(#000, 0.2)
	padding: 0.5rem 1rem
	&.add-day
		background-color: #05f
		color: #fff
		padding: 0.5rem 1.5rem
		&:hover
			background-color: #03c
			color: #fff
	&:hover
		background-color: transparent
		border-color: var(--font)
		box-shadow: 0 0 0 2px rgba(#000, 0.05)
	@media (prefers-color-scheme: dark)
		border-color: rgba(#fff, 0.2)
		&:hover
			box-shadow: 0 0 0 2px rgba(#fff, 0.1)

.or-separator
	display: flex
	flex-flow: row nowrap
	align-items: center
	margin: 0.5rem 0
	gap: 1rem
	.fill
		flex: 1 1 auto
		height: 0.5rem
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.15' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")
		background-size: 0.5rem
		@media (prefers-color-scheme: dark)
			background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.25' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")

.add-day-wrapper
	display: grid
	grid-template-columns: auto 1fr auto
	gap: 1rem
	.color-picker
		position: relative
		border: solid 1px rgba(#000, 0.2)
		&:hover
			border-color: #000
		> div
			width: 100%
			height: 100%
			box-sizing: border-box
		> input
			position: absolute
			top: 0
			left: 0
			width: 100%
			height: 100%
			opacity: 0
			cursor: pointer
</style>
