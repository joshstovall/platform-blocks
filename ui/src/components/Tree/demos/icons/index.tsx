import { Tree, TreeNode, Icon } from '../../../../components'

const treeData: TreeNode[] = [
  {
    id: 'project',
    label: 'My Project',
    children: [
      {
        id: 'src',
        label: 'src',
        children: [
          { 
            id: 'app.tsx', 
            label: 'App.tsx',
            icon: <Icon name="check" size="sm" color="#61dafb" />
          },
          { 
            id: 'index.ts', 
            label: 'index.ts',
            icon: <Icon name="star" size="sm" color="#3178c6" />
          },
          { 
            id: 'styles.css', 
            label: 'styles.css',
            icon: <Icon name="eye" size="sm" color="#1572b6" />
          },
        ],
      },
      {
        id: 'public',
        label: 'public',
        children: [
          { 
            id: 'favicon.ico', 
            label: 'favicon.ico',
            icon: <Icon name="star" size="sm" color="#ff6b6b" />
          },
          { 
            id: 'index.html', 
            label: 'index.html',
            icon: <Icon name="chevron-right" size="sm" color="#e34c26" />
          },
        ],
      },
      {
        id: 'docs',
        label: 'docs',
        children: [
          { 
            id: 'readme.md', 
            label: 'README.md',
            icon: <Icon name="check" size="sm" color="#083fa1" />
          },
          { 
            id: 'api.md', 
            label: 'API.md',
            icon: <Icon name="check" size="sm" color="#083fa1" />
          },
        ],
      },
      { 
        id: 'package.json', 
        label: 'package.json',
        icon: <Icon name="eye" size="sm" color="#cb3837" />
      },
      { 
        id: 'tsconfig.json', 
        label: 'tsconfig.json',
        icon: <Icon name="star" size="sm" color="#3178c6" />
      },
    ],
  },
];

export default function IconsTreeDemo() {
  return (
    <Tree
      data={treeData}
      expandAll
      onNavigate={(node) => {
        if (!node.children) {
          console.log('Opened file:', node.label);
        }
      }}
    />
  );
}
