import { OperatorFunction, Observable } from 'rxjs';
import { Executioner } from '../interfaces/executioner';
import { map } from 'rxjs/operators';
import { TableOptions } from '../interfaces/table-options';

function urlEncodedNameOrId(tableOptions: TableOptions): string {
    return tableOptions.tableId
        || encodeURIComponent(!!tableOptions.tableName ? tableOptions.tableName : '');
}

export function table(tableOptions: TableOptions): OperatorFunction<Executioner, Executioner> {
    return function tableOperator(source: Observable<Executioner>): Observable<Executioner> {
        return source.pipe(map<Executioner, Executioner>((exec: Executioner) => {

            if (!tableOptions.tableName && !tableOptions.tableId) {
                throw new Error('Table name or table ID is required');
            }

            if (exec.table) {
                throw new Error('You already defined a table');
            }

            return {
                ...exec,
                ...{
                    table: `${urlEncodedNameOrId(tableOptions)}`
                }
            };
        }));
    };
}
