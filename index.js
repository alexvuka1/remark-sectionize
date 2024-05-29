import { findAfter } from 'unist-util-find-after';
import { visit } from 'unist-util-visit';

const MAX_HEADING_DEPTH = 6

function plugin() {
  return transform
}

function transform(tree) {
  for (let depth = MAX_HEADING_DEPTH; depth > 0; depth--) {
    visit(
      tree,
      node => node.type === 'heading' && node.depth === depth,
      sectionize
    )
  }
}

function sectionize(node, index, parent) {
  const startNode = node
  const startIndex = index
  const depth = startNode.depth

  const isEnd = node => node.type === 'heading' && node.depth <= depth || node.type === 'export'
  const endNode = findAfter(parent, startNode, isEnd)
  const endIndex = parent.children.indexOf(endNode)

  const between = parent.children.slice(
    startIndex,
    endIndex > 0 ? endIndex : undefined
  )

  const start = between[0]?.position?.start;
  const end = between[between.length - 1]?.position?.end;

  const section = {
    type: 'section',
    depth: depth,
    children: between,
    data: {
      hName: 'section'
    },
    position: { start, end },
  }

  parent.children.splice(startIndex, section.children.length, section)
}

export default plugin
