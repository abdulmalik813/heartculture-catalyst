import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TableBlock } from '@/payload-types'
import { LexicalRenderer } from '@/components/lexical-renderer'
import { joinStyles } from '@/lib/make-styles'
import { GlobalData } from '@/types/global-data'

export async function TableBlockUI({
  globalData,
  ...tableBlock
}: TableBlock & { globalData: GlobalData }) {
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
                  globalData={globalData}
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
                  globalData={globalData}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
