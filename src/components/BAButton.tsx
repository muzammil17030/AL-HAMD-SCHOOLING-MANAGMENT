import { Button } from "@mui/material";

export default function BAButton({ label, onClick }: any) {
  return (
    <>
      <Button onClick={onClick} variant="contained">
        {label}
      </Button>
    </>
  );
}
