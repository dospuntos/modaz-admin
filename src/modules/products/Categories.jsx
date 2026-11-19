import { useState, useEffect } from "react";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: "auto",
    },
  },
};

function getCategoryName(id) {
  return categories.find((cat) => cat.id === Number(id))?.name ?? "";
}

export default function Categories({ categories, prodCats, handleChange }) {
  const [categoryName, setCategoryName] = useState([]);

  useEffect(() => {
    setCategoryName(prodCats);
  }, [prodCats]);

  function getCategoryName(id) {
    let categoryName = categories.find((data) => data.id === String(id))?.name;
    return categoryName !== undefined ? categoryName : "false";
  }

  return (
    <div>
      <FormControl fullwidth>
        <InputLabel id="categories">Categorías</InputLabel>
        <Select
          labelId="categories"
          multiple
          value={categoryName}
          onChange={(event) => handleChange(event.target.value)}
          input={<Input id="select-multiple-chip" />}
          renderValue={(selected) => (
            <div>
              {selected.map((value, key) => (
                <Chip key={key} label={getCategoryName(value)} />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {categories.map((cat) => {
            const parent = categories.find((c) => c.id === cat.parent_id);
            return (
              <MenuItem key={cat.id} value={cat.id}>
                {parent ? `${parent.name} › ${cat.name}` : cat.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
}
