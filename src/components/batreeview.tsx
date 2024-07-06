import Box from "@mui/material/Box";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { useNavigate } from "react-router-dom";

export default function BATreeView({ treeStructure }: any) {
  const randomId = () => {
    let id = Math.random().toString().slice(2);
    return id;
  };

  const navigate = useNavigate();

  const navigateScreem = (route: string) => {
    navigate(`/dashboard/${route}`);
  };

  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <SimpleTreeView>
        {treeStructure && treeStructure.length > 0
          ? treeStructure.map((x: any) => (
              <TreeItem itemId={randomId()} label={x.moduleName}>
                {x.child.map((y: any) => (
                  <TreeItem
                    onClick={() => {
                      navigateScreem(y.route);
                    }}
                    itemId={randomId()}
                    label={y.name}
                  />
                ))}
              </TreeItem>
            ))
          : null}
      </SimpleTreeView>
    </Box>
  );
}
