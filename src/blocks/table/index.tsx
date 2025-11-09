import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Page, Post, Setting, TableBlock } from '@/payload-types'
import { LexicalRenderer } from '@/components/lexical-renderer'
import { SearchParams } from '@/types/search-params'
import { joinStyles } from '@/lib/make-styles'

export async function TableBlockUI({
  searchParams,
  setting,
  page,
  ...tableBlock
}: TableBlock & { searchParams?: SearchParams } & { setting: Setting | null } & {
  page: Post | Page | null
}) {
  return (
    <Table className={joinStyles(tableBlock.tableStyles)}>
      {tableBlock.caption && (
        <TableCaption className={joinStyles(tableBlock.captionStyles)}>
          {tableBlock.caption}
        </TableCaption>
      )}
      {tableBlock.showHeader && tableBlock.headers && tableBlock.headers.length > 0 && (
        <TableHeader className={joinStyles(tableBlock.headerStyles)}>
          <TableRow>
            {tableBlock.headers.map((header) => (
              <TableHead key={header.id}>
                <LexicalRenderer
                  content={header.header}
                  searchParams={searchParams}
                  setting={setting}
                  page={page}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
      )}
      <TableBody className={joinStyles(tableBlock.bodyStyles)}>
        {tableBlock.rows.map((row) => (
          <TableRow key={row.id} className={joinStyles(row.rowStyles)}>
            {row.cells.map((cell) => (
              <TableCell key={cell.id} className={joinStyles(cell.cellStyles)}>
                <LexicalRenderer
                  content={cell.content}
                  searchParams={searchParams}
                  setting={setting}
                  page={page}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
