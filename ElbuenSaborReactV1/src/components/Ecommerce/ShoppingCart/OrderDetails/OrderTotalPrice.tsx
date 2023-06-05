import { useAppSelector } from "@app/Hooks";
import { useState, useEffect } from "react";
import "./OrderTotalPrice.scss";

export default function OrderTotalPrice() {

    const { order } = useAppSelector(state => state.cartProducts);

    const [totalProducts, setTotalProducts] = useState<number>(0);

    const sumProducts = () => {
        setTotalProducts(order.orderDetails.reduce((total, item) => total + item.quantity, 0));
    }

    useEffect(() => {
        sumProducts();
    }, [order]);

    return (
        <div className="order-total-price-info">
            <div className="separator">
                <label className="total-products">{totalProducts} artículos</label>
                <label>${order.total}</label>
            </div>
            <div className="separator">
                <label>Descuento</label>
                <label>{order.discount === 0 ?
                    ("---") :
                    `$${order.discount}`}
                </label></div>
            <div className="separator">
                <label><strong>Total:</strong></label>
                <label><strong>{order.discount === 0 ?
                    `$${order.total}` :
                    `$${order.total - order.discount}`}</strong></label>
            </div>
        </div>
    )
}
