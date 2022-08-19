import {writable, get as get$, derived} from 'svelte/store'

// daysInMounth [0]=January [11]=December
const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

function dayAbsolutValue(month: number, day: number) {
	let total = 0
	for (let i = 0; i < month; i++) {
		total += daysInMonth[i]
	}
	return total + day
}

function symmetricDayOffset(offset: number) {
	// convert 0 (sunday) to 6
	return offset === 0 ? 6 : offset-1
}

function compareDatObj(a: DateObj, o: '<'|'<='|'=='|'>='|'>', b: DateObj) {
	switch (o) {
	case '<':
		return a.year < b.year || a.month < b.month || a.date < b.date
	case '<=':
		return a.year <= b.year || a.month <= b.month || a.date <= b.date
	case '==':
		return a.year == b.year || a.month == b.month || a.date == b.date
	case '>=':
		return a.year >= b.year || a.month >= b.month || a.date >= b.date
	case '>':
		return a.year > b.year || a.month > b.month || a.date > b.date
	}
}

export type PlanTplDay = (
	{_t: 'day', color: string} | {_t: 'gap'}
)

export type DateObj = {
	year: number
	month: number // 0-11
	date: number // 0-27 | 0-29 | 0-30
}

export type DateObjUpdate = {
	year?: number
	month?: number // 0-11
	date?: number // 0-27 | 0-29 | 0-30
}

export type CalcDay = {
	date: Date
	isOffset?: true
	target?: PlanTplDay & {tplIdx: number}
	holidays: Array<string>
}

export type CalcPlan = Array<{
	year: number
	month: number
	days: Array<CalcDay>
}>

type t_$ = {
	begin: DateObj
	end: DateObj
	template: Array<PlanTplDay>
	publicHolidays: {[date: number]: string}
	schoolHolidays: {[date: number]: string}
	considerPublicHolidays: boolean
	considerSchoolHolidays: boolean
}

export class PlanTemplate {
	#store = writable<t_$>()
	readonly subscribe = this.#store.subscribe
	readonly $ =()=> get$(this.#store)
	constructor({
		begin, end, publicHolidays, schoolHolidays, template,
		considerPublicHolidays,
		considerSchoolHolidays,
	}: {
		begin: t_$['begin'],
		end: t_$['end'],
		template: t_$['template'],
		publicHolidays: t_$['publicHolidays'],
		schoolHolidays: t_$['schoolHolidays'],
		considerPublicHolidays?: t_$['considerPublicHolidays'],
		considerSchoolHolidays?: t_$['considerSchoolHolidays'],
	}) {
		this.#store.set({
			begin, end, template,
			publicHolidays, schoolHolidays,
			considerPublicHolidays: !!considerPublicHolidays,
			considerSchoolHolidays: !!considerSchoolHolidays,
		})
	}

	private tplLen($: t_$) {
		return Math.ceil($.template.length / 7) * 7
	}

	readonly templateLength = derived(this.#store, this.tplLen)

	public getTemplateDay(idx: number): PlanTplDay {
		const $ = this.$()
		if (idx > (this.tplLen($)-1)) {
			throw new Error(
				`index [${idx}] out of boundary (${this.tplLen($)-1})`
			)
		}
		if (idx > ($.template.length-1)) {
			return {_t: 'gap'}
		}
		return $.template[idx]
	}

	public add(day: PlanTplDay) {
		this.#store.update(($)=> {
			$.template.push(day)
			return $
		})
	}

	public remove(idx: number) {
		this.#store.update(($)=> {
			$.template.splice(idx, 1)
			return $
		})
	}

	public toggleConsiderPublicHolidays() {
		this.#store.update(($)=> {
			$.considerPublicHolidays = !$.considerPublicHolidays
			return $
		})
	}

	public toggleConsiderSchoolHolidays() {
		this.#store.update(($)=> {
			$.considerSchoolHolidays = !$.considerSchoolHolidays
			return $
		})
	}

	public setBegin(d: DateObj) {
		this.#store.update(($)=> {
			$.begin = d
			return $
		})
	}

	private _updateDate({year, month, date}: DateObjUpdate, D: DateObj) {
		if (!Number.isNaN(Number(date))) {
			if (date > daysInMonth[D.month]-1) {
				D.month++
				D.date = 0
				if (D.month > 11) {
					D.year++
				}
			} else if (date < 0) {
				D.month--
				if (D.month < 0) {
					D.year--
					D.month = 11
				}
				D.date = daysInMonth[D.month]-1
			} else {
				D.date = date
			}
		}
		if (!Number.isNaN(Number(month))) {
			if (D.month > 11) {
				D.year++
				D.month = 0
			} else if (month < 0) {
				D.year--
				D.month = 11
			} else {
				D.month = month
			}
		}
		if (!Number.isNaN(Number(year))) {
			D.year = year
		}
		return D
	}

	public updateBegin(d: DateObjUpdate) {
		this.#store.update(($)=> {
			let newDate = this._updateDate(d, {...$.begin})
			if (compareDatObj(newDate,'<=', $.end)) {
				$.begin = newDate
			}
			return $
		})
	}

	public setEnd(d: DateObj) {
		this.#store.update(($)=> {
			$.end = d
			return $
		})
	}

	public updateEnd(d: DateObjUpdate) {
		this.#store.update(($)=> {
			let newDate = this._updateDate(d, {...$.end})
			if (compareDatObj(newDate,'>=', $.begin)) {
				$.end = newDate
			}
			return $
		})
	}

	readonly calculated = derived(this.#store, ($)=> {
		const calcedPlan: CalcPlan = []
		const tplLen = this.tplLen($)
		const begin = new Date($.begin.year, $.begin.month, $.begin.date+1)
		const end = new Date($.end.year, $.end.month, $.end.date+1)

		let totalMonths = (
			12 - begin.getMonth() +
			(end.getFullYear() - begin.getFullYear() - 1) * 12 +
			end.getMonth() + 1
		)
		let month = begin.getMonth()
		let year = begin.getFullYear()
		let offset = symmetricDayOffset(begin.getDay())
		for (let m = 0; m < totalMonths; m++) {
			const days: Array<CalcDay> = []
			const firstMonthDay = new Date(year, month, 1)
			const monthOffset = symmetricDayOffset(firstMonthDay.getDay())
			for (let i = 0; i < monthOffset; i++) {
				days.push({
					date: firstMonthDay,
					isOffset: true,
					holidays: [],
				})
			}

			for (let d = 0; d < daysInMonth[month]; d++) {
				const day: CalcDay = {
					date: new Date(year, month, d+1),
					holidays: [],
				}
				const absolutDayN = dayAbsolutValue(month, d+1)
				if ($.considerPublicHolidays && absolutDayN in $.publicHolidays) {
					day.holidays.push($.publicHolidays[absolutDayN])
				}
				if ($.considerSchoolHolidays && absolutDayN in $.schoolHolidays) {
					day.holidays.push($.schoolHolidays[absolutDayN])
				}

				if (
					$.template.length > 0 &&
					(day.date >= begin && day.date <= end)
				) {
					if (day.holidays.length < 1) {
						const mod = offset % tplLen
						day.target = {
							tplIdx: mod,
							...this.getTemplateDay(mod),
						}
					}
					offset++
				}
				days.push(day)
			}

			const lastMonthDay = new Date(year, month, daysInMonth[month])
			const monthFillGap = symmetricDayOffset(lastMonthDay.getDay())
			for (let i = 0; i < 6-monthFillGap; i++) {
				days.push({date: lastMonthDay, isOffset: true, holidays: []})
			}

			calcedPlan.push({year, month, days})

			month++
			if (month == 12) {
				month = 0
				year++
			}
		}
		return calcedPlan
	})
}
