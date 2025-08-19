const orders = (req, res) => {  
    res.render("admin/pages/orders/index", {
        pageTitle: "Quản lý đơn hàng"
    });
}

export default {
    orders
};