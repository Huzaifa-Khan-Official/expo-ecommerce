import { useState } from "react";
import { PlusIcon, PencilIcon, Trash2Icon, XIcon, ImageIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../lib/api";
import { getStockStatusBadge } from "../lib/utils";

function ProductsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const queryClient = useQueryClient();

  // fetch some data
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: productApi.getAll,
  });

  // creating, update, deleting
  const createProductMutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: productApi.update,
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const closeModal = () => {
    // reset the state
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
    });
    setImages([]);
    setImagePreviews([]);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
    });
    setImagePreviews(product.images);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) return alert("Maximum 3 images allowed");

    // revoke previous blob URLs to free memory
    imagePreviews.forEach((url) => {
      if (url.startsWith("blob:")) URL.revokeObjectURL(url);
    });

    setImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // for new products, require images
    if (!editingProduct && imagePreviews.length === 0) {
      return alert("Please upload at least one image");
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("stock", formData.stock);
    formDataToSend.append("category", formData.category);

    // only append new images if they were selected
    if (images.length > 0) images.forEach((image) => formDataToSend.append("images", image));

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct._id, formData: formDataToSend });
    } else {
      createProductMutation.mutate(formDataToSend);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex items-center justify-between bg-base-100/60 backdrop-blur-md p-6 rounded-2xl border border-base-200/50 shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-base-content to-base-content/70 bg-clip-text text-transparent">Products</h1>
          <p className="text-base-content/70 mt-1 font-medium">Manage your product inventory</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn bg-gradient-to-r from-primary to-secondary text-primary-content border-none hover:shadow-lg hover:scale-105 transition-all duration-300 gap-2 font-bold">
          <PlusIcon className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products?.map((product) => {
          const status = getStockStatusBadge(product.stock);

          return (
            <div key={product._id} className="card bg-base-100/80 backdrop-blur-sm border border-base-200/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
              <div className="card-body p-5">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-24 h-24 rounded-2xl shadow-sm group-hover:scale-105 transition-transform duration-500">
                        <img src={product.images[0]} alt={product.name} className="object-cover" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="truncate pr-2">
                          <h3 className="text-lg font-bold truncate text-base-content/90 group-hover:text-primary transition-colors">{product.name}</h3>
                          <p className="text-primary/70 font-medium text-sm mt-0.5">{product.category}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center gap-2">
                         <div className={`badge badge-sm font-semibold px-2 py-3 shadow-sm ${status.class}`}>{status.text}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-base-200/40 rounded-xl p-4 flex items-center justify-between mt-2 border border-base-200/50">
                     <div className="flex gap-6">
                        <div>
                          <p className="text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-1">Price</p>
                          <p className="font-extrabold text-lg text-primary">Rs.{product.price}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-1">Stock</p>
                          <p className="font-extrabold text-lg text-base-content/80">{product.stock}</p>
                        </div>
                     </div>
                     <div className="flex gap-1">
                        <button
                          className="btn btn-sm btn-square btn-ghost hover:bg-primary/10 hover:text-primary transition-colors"
                          onClick={() => handleEdit(product)}
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          className="btn btn-sm btn-square btn-ghost text-error/70 hover:bg-error/10 hover:text-error transition-colors"
                          onClick={() => deleteProductMutation.mutate(product._id)}
                        >
                          {deleteProductMutation.isPending ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            <Trash2Icon className="w-4 h-4" />
                          )}
                        </button>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD/EDIT PRODUCT MODAL */}

      <input type="checkbox" className="modal-toggle" checked={showModal} />

      <div className="modal backdrop-blur-sm bg-base-300/40">
        <div className="modal-box max-w-2xl bg-base-100/95 backdrop-blur-xl border border-base-200 shadow-2xl rounded-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-base-200/50">
            <h3 className="font-extrabold text-2xl bg-gradient-to-r from-base-content to-base-content/70 bg-clip-text text-transparent">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h3>

            <button onClick={closeModal} className="btn btn-sm btn-circle btn-ghost bg-base-200/50 hover:bg-base-300">
              <XIcon className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-base-content/80">Product Name</span>
                </label>

                <input
                  type="text"
                  placeholder="Enter product name"
                  className="input input-bordered focus:input-primary transition-colors bg-base-200/30"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-base-content/80">Category</span>
                </label>
                <select
                  className="select select-bordered focus:select-primary transition-colors bg-base-200/30"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="" disabled>Select category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-base-content/80">Price (Rs.)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="input input-bordered focus:input-primary transition-colors bg-base-200/30"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-base-content/80">Stock</span>
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="input input-bordered focus:input-primary transition-colors bg-base-200/30"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-base-content/80">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered focus:textarea-primary transition-colors h-28 w-full bg-base-200/30"
                placeholder="Enter product description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-base flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  Product Images
                </span>
                <span className="label-text-alt font-medium opacity-60 bg-base-200 px-2 py-1 rounded">Max 3 images</span>
              </label>

              <div className="bg-base-200/30 rounded-xl p-5 border-2 border-dashed border-base-300 hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="file-input file-input-bordered file-input-primary w-full shadow-sm bg-base-100"
                  required={!editingProduct}
                />

                {editingProduct && (
                  <p className="text-xs font-medium text-base-content/50 mt-3 text-center bg-base-200/50 py-1.5 rounded-lg inline-block px-3 mx-auto flex w-fit">
                    Leave empty to keep current images
                  </p>
                )}
              </div>

              {imagePreviews.length > 0 && (
                <div className="flex gap-3 mt-4 justify-center">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="avatar indicator">
                      <div className="w-20 h-20 rounded-xl shadow-md border border-base-200 ring-2 ring-primary/20">
                        <img src={preview} alt={`Preview ${index + 1}`} className="object-cover" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-action mt-8 pt-4 border-t border-base-200/50">
              <button
                type="button"
                onClick={closeModal}
                className="btn btn-ghost hover:bg-base-200 font-bold"
                disabled={createProductMutation.isPending || updateProductMutation.isPending}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn bg-gradient-to-r from-primary to-secondary text-primary-content border-none hover:shadow-lg hover:scale-105 transition-all duration-300 font-bold px-8"
                disabled={createProductMutation.isPending || updateProductMutation.isPending}
              >
                {createProductMutation.isPending || updateProductMutation.isPending ? (
                  <span className="loading loading-spinner"></span>
                ) : editingProduct ? (
                  "Save Changes"
                ) : (
                  "Create Product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
