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

document.addEventListener("DOMContentLoaded", () => {
  // Search & filter form
  const form = document.getElementById("product-search-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const keyword = form.querySelector("input[name='keyword']").value;
      const gender = form.querySelector("select[name='gender']").value;
      const capacity = form.querySelector("select[name='capacity']").value;
      const season = form.querySelector("select[name='season']").value;
      const params = new URLSearchParams({ keyword, gender, capacity, season });
      try {
        const res = await fetch(`/product/search?${params.toString()}`);
        const data = await res.json();
        const list = document.getElementById("product-list");
        if (list) {
          list.innerHTML = data.products.map(product => `
            <div class="product-card">
              <img src="${product.image || ''}" alt="${product.name}" />
              <h2>${product.name}</h2>
              <p>${Number(product.price).toLocaleString()} VND</p>
              <p>Giới tính: ${product.gender || ''}</p>
              <p>Dung tích: ${product.capacity || ''}</p>
              <p>Mùa: ${product.season || ''}</p>
            </div>
          `).join("");
        }
      } catch (err) {
        alert("Lỗi tìm kiếm sản phẩm");
      }
    });
  }
});
