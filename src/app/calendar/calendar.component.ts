import { TasksService } from './../shared/tasks.service';
import { DateService } from './../shared/date.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

interface Day {
  value: moment.Moment
  active: boolean
  disabled: boolean
  selected: boolean
  hasTasks: boolean
}

interface Week {
  days: Day[]
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  calendar: Week[] = [];
  daysHaveTasks: string[] = [];

  constructor(
    private dateService: DateService, 
    private tasksService: TasksService
  ) { }

  ngOnInit(): void {
    this.tasksService.loadAll()
      .subscribe(days => {
        this.daysHaveTasks = days;
        this.dateService.date.subscribe(this.generate.bind(this))
      })
  }

  generate(now: moment.Moment) {
    const startDay = now.clone().startOf('month').startOf('week');
    const endDay = now.clone().endOf('month').endOf('week');

    const date = startDay.clone().subtract(1, 'day')

    const calendar = [];

    while (date.isBefore(endDay, 'day')) {
      calendar.push({
        days: Array(7).fill(0).map(() => {
          const value = date.add(1, 'day').clone();
          const active = moment().isSame(value, 'date');
          const disabled = !now.isSame(value, 'month');
          const selected = now.isSame(value, 'date');
          const hasTasks = this.daysHaveTasks.indexOf(date.format('DD-MM-YYYY')) > -1;
          return {value, active, disabled, selected, hasTasks}
        })
      })
    }

    this.calendar = calendar;
  
  }

  selectDay(day: moment.Moment) {
    this.dateService.changeDate(day);
  }
}
