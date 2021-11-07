<script>
	let yearSize = 365
	let pattern = [
		{ color: '#f399d3' },
		{ color: '#a7276e' },
		{ color: '#2c9c88' },
		{ color: '#713dc3' },
		{ color: '#00bfff' },
		{ isGap: true },
		{ isGap: true },
		{ color: '#f399d3' },
		{ color: '#a7276e' },
		{ color: '#2c9c88' },
	]
	let patternStart = 8
	let patternEnd = 210

	let addPatternDayModalState = false
	let colorInputValue = ''

	let complyHolidays = true
	let complySchoolHolidays = true
	function toggleComplyHolidays() {
		complyHolidays = !complyHolidays
	}
	function toggleComplySchoolHolidays() {
		complySchoolHolidays = !complySchoolHolidays
	}

	const holidays = {
		0:   { label: 'New Year\'s Eve' },
		6:   { label: 'Holy Three Kings' },
		100: { label: 'Good Friday' },
		102: { label: 'Easter Sunday' },
		103: { label: 'Easter Monday' },
		121: { label: 'Labour Day' },
		141: { label: 'Ascension Day' },
		152: { label: 'Whit Monday' },
		162: { label: 'Corpus Christi' },
		276: { label: 'German Unity Day' },
		305: { label: 'All Saints\' Day' },
		359: { label: 'Christmas Day' },
		360: { label: '2nd Day of Christmas' },
	}

	const schoolHolidays = [
		{
			label: 'Easter holiday',
			from: 96, until: 108,
		},
		{
			label: 'Whitsun holiday',
			from: 153, until: 164,
		},
		{
			label: 'Summer holiday',
			from: 211, until: 255,
		},
		{
			label: 'Autumn holiday',
			from: 299, until: 304,
		},
		{
			label: 'Christmas holiday',
			from: 357, until: 8,
		},
	]

	function openPatternDayModal() {
		addPatternDayModalState = true
	}
	function closePatternDayModal() {
		colorInputValue = ''
		addPatternDayModalState = false
	}

	function patternPush() {
		pattern.push({ color: colorInputValue })
		pattern = pattern
		closePatternDayModal()
	}

	function patternPushGap() {
		pattern.push({ isGap: true })
		pattern = pattern
		closePatternDayModal()
	}

	function patternDelete(index) {
		pattern.splice(index, 1)
		pattern = pattern
	}

	$:generatedYear =()=> {
		const year = []

		for (let dayIdx = 0; dayIdx < yearSize; dayIdx++) {
			let day = {
				number: dayIdx + 1,
				isGap: false,
				color: false,
				isHoliday: false,
				isSchool: false,
			}
			const schoolHoliday = schoolHolidays.find(
				(h)=> dayIdx >= h.from && dayIdx <= h.until
			)
			if (
				schoolHoliday !== undefined &&
				complySchoolHolidays
			) {
				day.isSchoolHoliday = true
				day.schoolHoliday = schoolHoliday
			}
			if ((holidays[dayIdx] !== undefined && holidays[dayIdx] !== null) && complyHolidays) {
				day.isHoliday = true
				day.holiday = holidays[dayIdx]
			}
			if (pattern.length > 0 && dayIdx+1 >= patternStart && dayIdx < patternEnd) {
				const patternDay = pattern[dayIdx % pattern.length]
				if (patternDay.isGap) {
					day.isGap = true
				}
				else if (patternDay.color) {
					day.color = patternDay.color
				}
			}
			year.push(day)
		}

		return year
	}
</script>

<style>
	h1 {
		font-size: 3rem;
		font-weight: 400;
		letter-spacing: .1rem;
	}

	main {
		margin: auto;
		max-width: 1200px;
		margin-bottom: 6rem;
		box-sizing: border-box;
	}

	.options {
		display: flex;
		flex-flow: row wrap;
		align-items: center;
	}
	.options > * {
		margin: 0 .5rem .5rem 0;
	}
	.options .check-fields {
		display: flex;
		flex-flow: row wrap;
	}
	.options .check-fields >:not(:last-child) {
		margin-right: 1rem;
	}

	.calendar {
		display: grid;
		justify-content: start;
		grid-template-columns: repeat(21, 3.325rem);
		grid-gap: .25rem;
		box-sizing: border-box;
	}

	.calendar .day, .pattern .day {
		position: relative;
		display: flex;
		flex-flow: row wrap;
		justify-content: center;
		align-content: center;
		align-items: center;
		height: 3.325rem;
		width: 3.325rem;
		background-color: var(--pattern-bg);
		font-size: .65rem;
		cursor: default;
		line-height: 1;
		font-weight: 600;
		box-sizing: border-box;
	}
	.calendar .day .symbole, .pattern .day .symbole {
		flex: 1 1 100%;
		text-align: center;
		font-size: 1rem;
	}
	.calendar .day.holiday,
	.calendar .day.school-holiday,
	.calendar .day.pattern-day,
	.pattern .day.pattern-day {
		color: #fff;
	}
	.calendar .day.gap, .pattern .day.gap {
		background-color: var(--pattern-bg);
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='.15' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
		background-size: .5rem;
		color: #666;
	}
	.calendar .day.holiday,
	.calendar .day.school-holiday {
		background-color: var(--pattern-holiday-bg);
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='.15' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
		background-size: .5rem;
	}

	.calendar .day .tool-tip {
		z-index: 1;
		position: absolute;
		left: auto;
		bottom: calc(100% + .5rem);
		padding: .25rem .75rem;
		background-color: #FFF;
		box-shadow:
			0 0 1px rgba(0, 0, 0, .1),
			0 3px 6px rgba(0, 0, 0, .25),
			0 20px 20px -12px rgba(0, 0, 0, .25);
		color: #000;
		border-radius: .15rem;
		transition: all ease .2s;
		pointer-events: none;
		box-sizing: border-box;
		font-size: 1rem;
		font-weight: 400;
	}
	.calendar .day .tool-tip span {
		display: block;
		line-height: 2;
		box-sizing: border-box;
		white-space: nowrap;
	}
	.calendar .day .tool-tip span:not(:last-child) {
		border-bottom: solid 1px rgba(0,0,0, .1);
	}
	.calendar .day .tool-tip:after {
		z-index: -1;
		content: '';
		position: absolute;
		bottom: -.25rem;
		left: calc(50% - .25rem);
		height: .5rem;
		width: .5rem;
		transform: rotate(45deg);
		background-color: inherit;
		border-radius: 0 0 .1rem 0;
		box-sizing: border-box;
	}
	.calendar .day:not(:hover) .tool-tip {
		opacity: 0;
		transform: translateY(.5rem);
	}

	.add-pattern-day-modal {
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		height: 100%;
		width: 100%;
		flex-flow: row nowrap;
		justify-content: center;
		align-content: flex-start;
		align-items: center;
		background-color: var(--overlay-bg);
		color: #000;
		box-sizing: border-box;
	}
	.add-pattern-day-modal .modal {
		display: grid;
		padding: 2rem;
		min-width: 400px;
		grid-gap: 1rem;
		background-color: #FFF;
		box-shadow:
			0 0 1px rgba(0, 0, 0, .5),
			0 10px 30px rgba(0, 0, 0, .5);
		border-radius: 10px;
		box-sizing: border-box;
	}
	.add-pattern-day-modal .color-preview {
		border-radius: 3px;
		width: 2.5rem;
		height: 2.5rem;
		border: solid 1px rgba(0, 0, 0, .2);
		box-sizing: border-box;
	}
	.add-pattern-day-modal .actions {
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		box-sizing: border-box;
	}
	.add-pattern-day-modal .actions button {
		padding: .5rem 1rem;
	}
	.add-pattern-day-modal .actions button:last-child {
		background-color: #05F;
		color: #FFF;
	}
	.add-pattern-day-modal .actions button:last-child:hover {
		background-color: #03C;
		color: #FFF;
	}
	.add-pattern-day-modal button {
		background-color: transparent;
		border: solid 1px rgba(0,0,0, .2);
	}
	.add-pattern-day-modal button:hover {
		background-color: rgba(0,0,0, .1);
	}

	.input-field .input-container {
		display: grid;
		width: 100%;
		grid-template-columns: auto 1fr;
		grid-gap: .5rem;
		align-content: stretch;
		align-items: stretch;
	}
	.input-field, .check-field {
		display: flex;
		flex-flow: row wrap;
		align-items: center;
	}
	.input-field .label {
		flex: 1 1 100%;
		margin-bottom: .25rem;
		font-size: .65rem;
		text-transform: uppercase;
		font-weight: 600;
		letter-spacing: .1rem;
	}
	.input-field input {
		width: 100%;
		height: 100%;
		margin: 0;
		flex: 1 1 auto;
	}
	.add-pattern-day-modal .input-field input {
		cursor: pointer;
	}

	.check-field .checkbox {
		position: relative;
		display: flex;
		height: 1rem;
		width: 1rem;
		margin: .5rem .5rem .5rem 0;
		padding: .5rem;
		justify-content: center;
		align-content: center;
		align-items: center;
		border-radius: .15rem;
		border: solid 1px rgba(0, 0, 0, .1);
		box-sizing: border-box;
	}
	.check-field .checkbox:after {
		content: '';
		position: absolute;
		height: .5rem;
		width: .5rem;
		border-radius: .1rem;
		background-color: #50F;
		opacity: 0;
	}
	.check-field:not(.active):hover .checkbox {
		border-color: rgba(0, 0, 0, .5);
	}
	.check-field.active .checkbox {
		border-color: #50F;
	}
	.check-field.active .checkbox:after {
		opacity: 1;
	}

	.pattern {
		display: flex;
		min-height: 3.325rem;
		margin: 2rem 0;
		padding: 2rem 0;
		border: solid var(--options-border);
		border-width: 1px 0 1px 0;
		flex-flow: row wrap;
	}
	.pattern .day .delete {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 100%;
		color: #FFF;
		background-color: rgba(0, 0, 0, .75);
		cursor: pointer;
	}
	.pattern .day:not(:hover) .delete {
		opacity: 0;
		pointer-events: none;
	}
	.pattern .day, .pattern .add-day {
		margin: 0 .25rem .25rem 0;
	}
	.pattern .add-day {
		display: flex;
		flex-flow: row wrap;
		justify-content: center;
		align-content: center;
		align-items: center;
		height: 3.325rem;
		width: 3.325rem;
		padding: 0;
		background-color: var(--pattern-bg);
		color: var(--fg);
		font-size: 3rem;
		cursor: pointer;
		line-height: 1;
		font-weight: 100;
		box-sizing: border-box;
		border-radius: 0;
		border: none;
	}
	.pattern .add-day:hover {
		background-color: var(--fg);
		color: var(--bg);
	}
	.pattern .add-day svg {
		transform: rotate(45deg);
	}

	@media (prefers-color-scheme: dark) {
		.check-field .checkbox {
			border: solid 1px rgba(255, 255, 255, .25);
		}
		.check-field:not(.active):hover .checkbox {
			border-color: rgba(255, 255, 255, .75);
		}
		.calendar .day.gap, .pattern .day.gap {
			background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFFFFF' fill-opacity='.15' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
		}
		.calendar .day .tool-tip {
			box-shadow:
				0 0 1px rgba(0,0,0, .5),
				0 3px 6px rgba(0,0,0, .5),
				0 20px 20px -12px rgba(0,0,0, .5);
		}
	}
</style>

<main>
	<h1>Pattern Visualizer</h1>

	<div class='options'>
		<div class='input-field'>
			<span class='label'>Year size</span>
			<input type='number' bind:value={ yearSize }>
		</div>
		<div class='input-field'>
			<span class='label'>Pattern start</span>
			<input type='number' bind:value={ patternStart }>
		</div>
		<div class='input-field'>
			<span class='label'>Pattern end</span>
			<input type='number' bind:value={ patternEnd }>
		</div>
		<div class='check-fields'>
			<div class='check-field' class:active={ complyHolidays } on:click={ toggleComplyHolidays }>
				<div class='checkbox'/>
				<span class='label'>Comply holidys</span>
			</div>
			<div class='check-field' class:active={ complySchoolHolidays } on:click={ toggleComplySchoolHolidays }>
				<div class='checkbox'/>
				<span class='label'>Comply school holidys</span>
			</div>
		</div>
	</div>

	<div class='pattern'>
		{#each pattern as day, dayCount}
			{#if day.isGap}
				<div class='day gap'>
					<span class='label'>{ dayCount + 1 }</span>
					<span class='symbole'>_ _ _</span>
					<div class='delete' on:click={ ()=> patternDelete(dayCount) }>
						<svg viewBox='0 0 496.1 496.1' height='1.5rem' width='1.5rem'><path d='M259.4 248L493.8 13.7a8 8 0 00-11.4-11.4L248.1 236.7 13.8 2.3A8 8 0 002.4 13.7L236.8 248 2.4 482.3a8 8 0 1011.4 11.4L248 259.3l234.3 234.4a8 8 0 0011.4-11.4L259.4 248z' fill='currentColor'/></svg>
					</div>
				</div>
			{:else}
				<div
				class='day pattern-day'
				style='background-color: {day.color};'>
					<span class='label'>{ dayCount + 1 }</span>
					<span class='symbole'>____</span>
					<div class='delete' on:click={ ()=> patternDelete(dayCount) }>
						<svg viewBox='0 0 496.1 496.1' height='1.5rem' width='1.5rem'><path d='M259.4 248L493.8 13.7a8 8 0 00-11.4-11.4L248.1 236.7 13.8 2.3A8 8 0 002.4 13.7L236.8 248 2.4 482.3a8 8 0 1011.4 11.4L248 259.3l234.3 234.4a8 8 0 0011.4-11.4L259.4 248z' fill='currentColor'/></svg>
					</div>
				</div>
			{/if}
		{/each}
		<button class='add-day' on:click={ openPatternDayModal }>
			<svg viewBox='0 0 496.1 496.1' height='1.25rem' width='1.25rem' transform='rotate(45)'><path d='M259.4 248L493.8 13.7a8 8 0 00-11.4-11.4L248.1 236.7 13.8 2.3A8 8 0 002.4 13.7L236.8 248 2.4 482.3a8 8 0 1011.4 11.4L248 259.3l234.3 234.4a8 8 0 0011.4-11.4L259.4 248z' fill='currentColor'/></svg>
		</button>
	</div>

	<div class='calendar'>
		{#each generatedYear() as day}
			{#if day.isHoliday || day.isSchoolHoliday}
				<div
				class='day'
				class:holiday={ day.isHoliday }
				class:school-holiday={ day.isSchoolHoliday }>
					<span class='label'>{ day.number }</span>
					{#if day.isHoliday && day.isSchoolHoliday}
						<span class='symbole'>::::::</span>
					{:else}
						<span class='symbole'>......</span>
					{/if}
					<div class='tool-tip'>
						{#if day.isHoliday}
							<span>
								{ day.holiday.label }
							</span>
						{/if}
						{#if day.isSchoolHoliday}
							<span>
								{ day.schoolHoliday.label }
							</span>
						{/if}
					</div>
				</div>
			{:else if day.isGap}
				<div class='day gap'>
					<span class='label'>{ day.number }</span>
					<span class='symbole'>_ _ _</span>
				</div>
			{:else if day.color}
				<div
				class='day pattern-day'
				style='background-color: {day.color};'>
					<span class='label'>{ day.number }</span>
					<span class='symbole'>____</span>
				</div>
			{:else}
				<div class='day'>
					{ day.number }
				</div>
			{/if}
		{/each}
	</div>
</main>

{#if addPatternDayModalState}
	<div class='add-pattern-day-modal'>
		<div class='modal'>
			<div class='input-field'>
				<span class='label'>Color</span>
				<div class='input-container'>
					<div
						class='color-preview'
						style='background-color: { colorInputValue };'
					/>
					<input type='color' bind:value={ colorInputValue }/>
				</div>
			</div>
			<button on:click={ patternPushGap }>
				Add as gap
			</button>
			<div class='actions'>
				<button class='cancel' on:click={ closePatternDayModal }>
					Cancel
				</button>
				<button class='submit' on:click={ patternPush }>
					Add
				</button>
			</div>
		</div>
	</div>
{/if}
