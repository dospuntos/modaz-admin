import { toast } from "react-toastify";
import { toggleFeatured, deleteProduct, changeStock } from "api/productApi";
import _ from "lodash";

export default function productReducer(products, action) {
  switch (action.type) {
    // set state
    case "set":
      return action.data;

    // Toggle featured state in API and current state
    case "featuredToggle": {
      const { id, featured } = action;

      // send change to API
      toggleFeatured(id, featured);

      let tempProducts = products;
      let prevState = _.find(tempProducts, { id: id })["featured"];
      let newState = 1 - prevState;
      _.set(_.find(tempProducts, { id: id }), "featured", newState);

      if (newState) {
        toast.success("Producto destacado");
      } else {
        toast.warning("Producto NO destacado");
      }
      return [...tempProducts];
    }
    // Not a valid action

    case "publishedToggle": {
      const { id, state } = action;

      if (state) {
        toast.success("Producto publicado");
      } else {
        toast.warning("Producto despublicado");
      }

      return products.map((product) =>
        product.id === id ? { ...product, state } : product,
      );
    }

    case "updateStock": {
      const { id, dir, productId } = action;

      // Apply changes in database
      changeStock(id, dir);
      let tempProducts = products;
      let prevTotalstock = _.find(tempProducts, { id: productId })[
        "totalstock"
      ];
      let prevVariantstock = _.find(
        _.flatten(_.map(tempProducts, "variants")),
        {
          vid: id,
        },
      )["stock"];
      let newTotalStock = dir ? prevTotalstock + 1 : prevTotalstock - 1;
      let newVariantStock = dir
        ? Number(prevVariantstock) + 1
        : Number(prevVariantstock) - 1;

      // Update totalstock (products->productId->totalstock)
      _.set(
        _.find(tempProducts, { id: productId }),
        "totalstock",
        newTotalStock,
      );

      // Update variant (products->productId->variants->vId->totalstock)
      _.set(
        _.find(_.flatten(_.map(tempProducts, "variants")), {
          vid: id,
        }),
        "stock",
        newVariantStock,
      );
      toast.info("Stock del producto cambiado a " + newVariantStock);
      return [...tempProducts];
    }

    case "delete": {
      const { id } = action;

      toast.info("Producto eliminado.");

      return products.filter((item) => item.id !== id);
    }

    default:
      throw new Error("Unhandled action " + action.type);
  }
}
