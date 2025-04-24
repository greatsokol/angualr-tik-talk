import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ajax} from "rxjs/internal/ajax/ajax";
import {
  auditTime, catchError, combineLatest, concat,
  debounceTime, delay,
  distinctUntilChanged,
  filter, finalize,
  find,
  first, firstValueFrom, forkJoin,
  fromEvent,
  interval, lastValueFrom, map, merge,
  of, pairwise, race, reduce, retry, scan,
  skip, switchMap,
  take,
  tap, throttleTime,
  throwError,
  timer, withLatestFrom, zip
} from "rxjs";
import {interpolate} from "nx/src/tasks-runner/utils";

@Component({
  selector: 'lib-experimental',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experimental.component.html',
  styleUrl: './experimental.component.scss',
})
export class ExperimentalComponent {

  constructor() {
    // fetch('https://icherniakov.ru/yt-course/account/test_accounts').then(r => console.log(r.json()));

    // learnrxjs.io

    // конвенция имен - все реактивное с долларом на конце

    // порождающие операторы ===========================================================================================
    ajax('https://icherniakov.ru/yt-course/account/test_accounts').subscribe(r => console.log(r));
    const observable1$ = of(1, 2, 3, 4, 5, 6);
    const observable2$ = interval(1000);
    const observable3$ = timer(1000);
    const observable4$ = timer(2000, 1000); // как interval
    const observable5$ = fromEvent(document.body, 'click');
    const observable6$ = throwError(() => 123);


    const observable$ = timer(0, 500)
      .pipe(
        // фильтрующие операторы =======================================================================================

        //filter(value => value < 5)
        //take(3) // отписывается после достижения количества
        //first() // то же самое что и take(1)
        // skip(10)
        // find(value => value === 3), // отписывается после нахождения
        // distinctUntilChanged() // не пропускает одинаковые, идущие подряд значения
        // distinctUntilChanged((a, b) => a === b),
        tap(() => console.log('click')), // tap нужен для сайдэффектов
        //debounceTime(500)
        // throttleTime(500)
        // auditTime(500)

        // трансформирующие операторы
        map(value => value * 2),
        reduce((accum, current) => {
          return accum + current;
        }, 0),
        scan((accum, current) => {
          return accum + current;
        }, 0),
      );

    observable$.subscribe({
      next: (next) => console.log('next', next),
      error: error => console.log('error', error),
      complete: () => console.log('complete')
    });


    // комбинирующие операторы =========================================================================================

    // combineLatest ждет, чтобы все observable выдали значения
    const combine$ = combineLatest([
      interval(1000).pipe(map(i => '1_' + i)),
      interval(200).pipe(map(i => '2_' + i)),
      fromEvent(document.body, 'click')
    ]);

    // значения из observable-ов по порядку
    const zip$ = zip([
      interval(1000).pipe(map(i => '1_' + i)),
      interval(200).pipe(map(i => '2_' + i)),
      fromEvent(document.body, 'click')
    ]);

    // завершенные, последние значения из observable-ов
    // нужен, чтобы выполнить все запросы и только потом пойти дальше
    // может принимать массив
    const forkJoinArr$ = forkJoin([
      interval(1000).pipe(map(i => '1_' + i), take(2)),
      interval(200).pipe(map(i => '2_' + i), take(2)),
    ]);
    // может принимать объект
    const forkJoinObj$ = forkJoin({
      interval1: interval(1000).pipe(map(i => '1_' + i), take(2)),
      interval2: interval(200).pipe(map(i => '2_' + i), take(2)),
    });

    // объединить несколько потоков без упорядочивания
    const merge$ = merge(
      interval(1000).pipe(map(i => '1_' + i)),
      interval(200).pipe(map(i => '2_' + i)),
    );
    // по два значения - предыдущее и следующее
    merge$.pipe(pairwise())

    // объединить несколько потоков с упорядочиванием
    const concat$ = concat(
      interval(1000).pipe(map(i => '1_' + i), take(2)), // не дойдем до второго потока, если не остановится первый (take)
      interval(200).pipe(map(i => '2_' + i)),
    );

    // какой поток первый - тот и будет пропущен далее
    const race$ = race(
      interval(1000).pipe(map(i => '1_' + i), take(2)),
      interval(200).pipe(map(i => '2_' + i), take(2)),
    );

    const obs1$ = interval(1000);
    const obs2$ = interval(1000);
    // комбинирование с последним (актуальным) значением из другого потока
    const withLatest$ = interval(3000).pipe(withLatestFrom(obs1$, obs2$));

    // обработчики ошибок ==============================================================================================
    const err$ = timer(0, 500)
      .pipe(
        switchMap(value => {
          if (value < 5) return of(value);

          return throwError(() => value);
        }),
        // обработка ошибки
        catchError(err => {
          return of(false)
        }),
        // в случае ошибки повторяет поток
        retry(1),
        retry({
          count: 1,
          resetOnSuccess: true,
          delay: (error, retryCount) => {
            if(retryCount<5) {
              return  timer(retryCount * 500)
            }
            throw error;
          }
        }),
      );

    // utility операторы ===============================================================================================
    const utility$ = timer(0, 500)
      .pipe(
        delay(5000),
        finalize(() => console.log('finalize'))
      )

    // преобразование к Promise ========================================================================================
    firstValueFrom(utility$);
    lastValueFrom(utility$);
  }
}
