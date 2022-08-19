<script lang='ts'>
import AddTemplateDay from './AddTemplateDay.svelte'
import {PlanTemplate} from './plan'

let thePlanTpl = new PlanTemplate({
	begin: {year: 2022, month: 8, date: 12},
	end: {year: 2023, month: 6, date: 24},
	publicHolidays: {
		0: `New Year's Eve`,
		6: `Holy Three Kings`,
		100: `Good Friday`,
		102: `Easter Sunday`,
		103: `Easter Monday`,
		121: `Labour Day`,
		141: `Ascension Day`,
		152: `Whit Monday`,
		162: `Corpus Christi`,
		276: `German Unity Day`,
		305: `All Saints' Day`,
		359: `Christmas Day`,
		360: `2nd Day of Christmas`,
	},
	schoolHolidays: {
		96: `Easter holiday`,
		97: `Easter holiday`,
		98: `Easter holiday`,
		99: `Easter holiday`,
		100: `Easter holiday`,
		101: `Easter holiday`,
		102: `Easter holiday`,
		103: `Easter holiday`,
		104: `Easter holiday`,
		105: `Easter holiday`,
		106: `Easter holiday`,
		107: `Easter holiday`,
		108: `Easter holiday`,

		153: `Whitsun holiday`,
		154: `Whitsun holiday`,
		155: `Whitsun holiday`,
		156: `Whitsun holiday`,
		157: `Whitsun holiday`,
		158: `Whitsun holiday`,
		159: `Whitsun holiday`,
		160: `Whitsun holiday`,
		161: `Whitsun holiday`,
		162: `Whitsun holiday`,
		163: `Whitsun holiday`,
		164: `Whitsun holiday`,

		211: `Summer holiday`,
		212: `Summer holiday`,
		213: `Summer holiday`,
		214: `Summer holiday`,
		215: `Summer holiday`,
		216: `Summer holiday`,
		217: `Summer holiday`,
		218: `Summer holiday`,
		219: `Summer holiday`,
		220: `Summer holiday`,
		221: `Summer holiday`,
		222: `Summer holiday`,
		223: `Summer holiday`,
		224: `Summer holiday`,
		225: `Summer holiday`,
		226: `Summer holiday`,
		227: `Summer holiday`,
		228: `Summer holiday`,
		229: `Summer holiday`,
		230: `Summer holiday`,
		231: `Summer holiday`,
		232: `Summer holiday`,
		233: `Summer holiday`,
		234: `Summer holiday`,
		235: `Summer holiday`,
		236: `Summer holiday`,
		237: `Summer holiday`,
		238: `Summer holiday`,
		239: `Summer holiday`,
		240: `Summer holiday`,
		241: `Summer holiday`,
		242: `Summer holiday`,
		243: `Summer holiday`,
		244: `Summer holiday`,
		245: `Summer holiday`,
		246: `Summer holiday`,
		247: `Summer holiday`,
		248: `Summer holiday`,
		249: `Summer holiday`,
		250: `Summer holiday`,
		251: `Summer holiday`,
		252: `Summer holiday`,
		253: `Summer holiday`,
		254: `Summer holiday`,
		255: `Summer holiday`,

		299: `Autumn holiday`,
		300: `Autumn holiday`,
		301: `Autumn holiday`,
		302: `Autumn holiday`,
		303: `Autumn holiday`,
		304: `Autumn holiday`,

		357: `Christmas holiday`,
		358: `Christmas holiday`,
		359: `Christmas holiday`,
		360: `Christmas holiday`,
		361: `Christmas holiday`,
		362: `Christmas holiday`,
		363: `Christmas holiday`,
		364: `Christmas holiday`,
		365: `Christmas holiday`,
		1: `Christmas holiday`,
		2: `Christmas holiday`,
		3: `Christmas holiday`,
		4: `Christmas holiday`,
		5: `Christmas holiday`,
		6: `Christmas holiday`,
		7: `Christmas holiday`,
		8: `Christmas holiday`,
	},
	template: [
		{_t: 'day', color: '#f399d3'}, // monday
		{_t: 'day', color: '#a7276e'}, // tuesday
		{_t: 'day', color: '#2c9c88'}, // wednesday
		{_t: 'day', color: '#713dc3'}, // thursday
		{_t: 'day', color: '#00bfff'}, // friday
		{_t: 'gap'}, // saturday
		{_t: 'gap'}, // sunday
		{_t: 'day', color: '#f399d3'}, // monday
		{_t: 'day', color: '#a7276e'}, // tuesday
		{_t: 'day', color: '#2c9c88'}, // wednesday
		// will fill up thursday, friday, saturday, sunday as gap
	],
})

let isOpen_AddTplDay = false
function openAddTplDayModal() {
	isOpen_AddTplDay = true
}

function toLetters(num: number) {
	const mod = num % 26
	let pow = num / 26 | 0
	const out = (
		mod ? String.fromCharCode(64 + mod) : (--pow, 'Z')
	)
	return pow ? toLetters(pow) + out : out
}

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const monthName = [
	'January', 'February', 'March', 'April', 'May', 'June', 'Juli',
	'August', 'September', 'October', 'November', 'Dezember',
]

const calculatedPlan = thePlanTpl.calculated
const templateLen = thePlanTpl.templateLength
</script>



<style lang='stylus' global>@import './App.styl';</style>



<main>
	<h1 id='Title'>Plan* Visualizer</h1>

	<p id='Explanation'>
		I used this small project to understand how I would calculate
		a plan template for my actual project "Timetabler".
		It calculates the relative values from the template into absolute values
		within a given period of time (usually a given week).
		A template must be divisible by 7, otherwise the calculator will
		fill up the missing days as gaps.
	</p>

	<div class='config'>
		<div class='date-inputs'>
			<div class='input-field'>
				<span class='label'>Plan begin (year | month | day)</span>
				<div class='date-input'>
					<input
						type='number' value={$thePlanTpl.begin.year}
						on:input={(e)=> {
							thePlanTpl.updateBegin({year: Number(e.currentTarget.value)})
						}}
					/>
					<input
						type='number' value={$thePlanTpl.begin.month+1}
						on:input={(e)=> {
							thePlanTpl.updateBegin({month: Number(e.currentTarget.value)-1})
						}}
					/>
					<input
						type='number' value={$thePlanTpl.begin.date+1}
						on:input={(e)=> {
							thePlanTpl.updateBegin({date: Number(e.currentTarget.value)-1})
						}}
					/>
				</div>
			</div>

			<div class='input-field'>
				<span class='label'>Plan end (year | month | day)</span>
				<div class='date-input'>
					<input
						type='number' value={$thePlanTpl.end.year}
						on:input={(e)=> {
							thePlanTpl.updateEnd({year: Number(e.currentTarget.value)})
						}}
					/>
					<input
						type='number' value={$thePlanTpl.end.month+1}
						on:input={(e)=> {
							thePlanTpl.updateEnd({month: Number(e.currentTarget.value)-1})
						}}
					/>
					<input
						type='number' value={$thePlanTpl.end.date+1}
						on:input={(e)=> {
							thePlanTpl.updateEnd({date: Number(e.currentTarget.value)-1})
						}}
					/>
				</div>
			</div>
		</div>

		<div class='check-fields'>
			<div on:click={()=> thePlanTpl.toggleConsiderPublicHolidays()}
			class='check-field' class:active={$thePlanTpl.considerPublicHolidays}>
				<div class='checkbox'/>
				<span class='label'>Consider public holidys</span>
			</div>

			<div on:click={()=> thePlanTpl.toggleConsiderSchoolHolidays()}
			class='check-field' class:active={$thePlanTpl.considerSchoolHolidays}>
				<div class='checkbox'/>
				<span class='label'>Consider school holidys</span>
			</div>
		</div>
	</div>

	<div class='calendars-header'>
		{#each dayNames as name}<span>{name}</span>{/each}
	</div>

	<div class='pattern'>
		{#each $thePlanTpl.template as day, idx}
			{#if day._t === 'gap'}
				<div class='day gap'>
					<span class='label'>{toLetters(idx+1)}</span>
					<div on:click={()=> thePlanTpl.remove(idx)} class='delete'>
						<svg class='icon' viewBox='0 0 10 10' fill='none' xmlns='http://www.w3.org/2000/svg'>
							<path stroke='currentColor' stroke-width='0.3' d='m1 9 4-4m0 0 4-4M5 5l4 4M5 5 1 1'/>
						</svg>
					</div>
				</div>
			{:else}
				<div class='day pattern-day' style='background-color: {day.color};'>
					<span class='label'>{toLetters(idx+1)}</span>
					<div on:click={()=> thePlanTpl.remove(idx)} class='delete'>
						<svg class='icon' viewBox='0 0 10 10' fill='none' xmlns='http://www.w3.org/2000/svg'>
							<path stroke='currentColor' stroke-width='0.3' d='m1 9 4-4m0 0 4-4M5 5l4 4M5 5 1 1'/>
						</svg>
					</div>
				</div>
			{/if}
		{/each}

		<button on:click={openAddTplDayModal} class='add-day'>
			<svg class='icon' viewBox='0 0 10 10' fill='none' xmlns='http://www.w3.org/2000/svg'>
				<path stroke='currentColor' stroke-width='0.3' d='m1 9 4-4m0 0 4-4M5 5l4 4M5 5 1 1'/>
			</svg>
		</button>

		{#each Array(Math.max(0, $templateLen - $thePlanTpl.template.length - 1)) as _, idx}
			<div class='day offset-fill'>
				<span class='label'>{toLetters($thePlanTpl.template.length + 2 + idx)}</span>
			</div>
		{/each}
	</div>

	<div class='calendar'>
		{#each $calculatedPlan as {year, month, days}}
			<div class='month'>
				<div class='title'>
					<h1>{monthName[month]} - {year}</h1>
					<span/>
				</div>
				<div class='days'>
					{#each days as day}
						{#if day.isOffset}
							<div class='day offset-fill'/>
						{:else if day.holidays.length > 0}
							<div class='day holiday'>
								<span class='label'>{day.date.getDate()}</span>
		
								<span class='amount'>
									{#each Array(day.holidays.length) as _}.{/each}
								</span>
		
								<div class='tool-tip'>
									{#each day.holidays as holiday}
										<span>{holiday}</span>
									{/each}
								</div>
							</div>
						{:else if day.target}
							{#if day.target._t === 'gap'}
								<div class='day gap'>
									<span class='label'>{day.date.getDate()}</span>
									<span class='plan-index'>
										{toLetters(day.target.tplIdx + 1)}
									</span>
								</div>
							{:else}
								<div class='day pattern-day' style:background-color={day.target.color}>
									<span class='label'>{day.date.getDate()}</span>
									<span class='plan-index'>
										{toLetters(day.target.tplIdx + 1)}
									</span>
								</div>
							{/if}
						{:else}
							<div class='day'>{day.date.getDate()}</div>
						{/if}
					{/each}
				</div>
			</div>
		{/each}
	</div>
</main>

<AddTemplateDay
	bind:open={isOpen_AddTplDay}
	on:addEntry={({detail: color})=> {
		thePlanTpl.add({_t: 'day', color})
	}}
	on:addGap={()=> {
		thePlanTpl.add({_t: 'gap'})
	}}
/>
