import {useState, useEffect, useContext} from 'react'
import { CheckOutlined } from '@ant-design/icons';
import {Button} from 'antd';
import axios from 'axios';
import {AuthContext} from '../App';

const Subscription = () => {

    const [products, setProducts] = useState([]);
    const [price, setPrice] = useState(7.99);
    const [message, setMessage] = useState();
    const {FB_USER} = useContext(AuthContext);

    useEffect(async () => {

        const query = new URLSearchParams(window.location.search);
    
        if (query.get("success")) 
            setMessage("Order placed! You will receive an email confirmation.");
        else if (query.get("canceled")) 
            setMessage("Order canceled -- continue to shop around and checkout when you're ready.");
        else {
            const products_res = await axios.get(`${window.appdata.API_ADDR}/products`);
            setProducts(products_res.data.rows);
        }
    }, []);
    
    async function attemptSubscription(){
        const data = {customer:FB_USER.stripe_customer_id, email:FB_USER.email};
        try{
            const session_res = await axios.post(`${window.appdata.API_ADDR}/create-checkout-session`, data);
            window.location.href = session_res.data.url;
        }
        catch(err){
            //TODO: centralize this error
            setMessage('Checkout error.');
        }
    }

    function SubscribeButton(){
        const isSubscribed = !!FB_USER?.sub_exp;
        return <Button onClick={attemptSubscription} disabled={isSubscribed} type='default' className="subscribe-btn">
            {isSubscribed ? 'Already subscribed' : 'Subscribe'}
        </Button>;
    };

    function BeforeSubscriptionAttempt(){
        return (
            <>
            <div className="subscription-title">Standard</div>
                {products.map(product => {
                     return (
                        <div key={product.product_code} className="subscription-option">
                            <div className="price-text"><span className="price">${product.price}</span><span className="month-text"> / month</span> </div>
                            <SubscribeButton></SubscribeButton>
                            <div className="subscription-perks-container">
                                <p className="subscription-perks"><CheckOutlined className="subscribe-check-icon"/>Boost your productivity</p>
                                <p className="subscription-perks"><CheckOutlined className="subscribe-check-icon"/>Gain valuable insights into your investments</p>
                                <div className="subscription-details">
                                    <p className="subscription-detail">2000 queries per month</p>
                                </div>
                            </div>
                        </div>)
                })}
            </>
        )
    }

    function AfterSubscriptionAttempt(){
        return <div id="subscription-message">
            {message}
        </div>
    }

    return <div id="subscription-full">
        <div id="subscription-page">

            <div>
                <div id="subscriptions-container">
                    {message ? AfterSubscriptionAttempt() : BeforeSubscriptionAttempt()}
                </div>
            </div>

        </div>
    </div>
  
}

export default Subscription;