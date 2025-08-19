document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".add-to-cart");

  if (btn) {
    btn.addEventListener("click", async () => {
      const productId = btn.getAttribute("data-product-id");

      try {
        const res = await fetch("/wishlist/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ product_id: productId })
        });

        const data = await res.json();
        if (res.ok) {
          alert("✅ " + data.message);
        } else {
          alert("⚠️ " + data.message);
        }
      } catch (err) {
        console.error("Wishlist error:", err);
        alert("Có lỗi xảy ra!");
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".remove-from-wishlist").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const wishlistId = btn.dataset.wishlistId;

      try {
        const res = await fetch("/remove", {
          method: "POST", // POST để chắc chắn body được gửi
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wishlistId })
        });

        const data = await res.json();

        if (res.ok) {
          btn.closest(".product-card").remove();

          const countElem = document.getElementById("wishlist-count");
          const count = document.querySelectorAll(".product-card").length;
          countElem.textContent = `Sản phẩm yêu thích hiện tại (${count})`;
        } else {
          alert(data.message || "Xóa thất bại");
        }
      } catch (err) {
        console.error(err);
        alert("Có lỗi xảy ra, thử lại sau.");
      }
    });
  });
});
