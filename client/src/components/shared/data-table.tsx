'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

interface Column<T> {
  key: string;
  title: string;
  render?: (value: unknown, item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onSort?: (key: string) => void;
  sortKey?: string;
  sortOrder?: 'asc' | 'desc';
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  onSort,
  sortKey,
}: DataTableProps<T>) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>
                {column.sortable && onSort ? (
                  <Button
                    variant="ghost"
                    onClick={() => onSort(column.key)}
                    className="flex items-center gap-1 -ml-4"
                  >
                    {column.title}
                    <ArrowUpDown
                      className={`h-4 w-4 ${
                        sortKey === column.key ? 'opacity-100' : 'opacity-50'
                      }`}
                    />
                  </Button>
                ) : (
                  column.title
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {column.render
                      ? column.render(item[column.key], item)
                      : String(item[column.key] || '')}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

