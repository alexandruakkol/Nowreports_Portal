import {useState, useEffect, useContext} from 'react'
import { CheckOutlined } from '@ant-design/icons';
import {Button} from 'antd';
import axios from 'axios';
import {AuthContext} from '../App';

const Subscription = () => {

    const [price, setPrice] = useState(7.99);
    const [message, setMessage] = useState();
    const {FB_USER} = useContext(AuthContext);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
    
        if (query.get("success")) 
          setMessage("Order placed! You will receive an email confirmation.");
        
        if (query.get("canceled")) 
          setMessage("Order canceled -- continue to shop around and checkout when you're ready.");
    }, []);
    
    async function attemptSubscription(){
        const data = {customer:FB_USER.stripe_customer_id};
        const session_res = await axios.post('/create-checkout-session', data);
        window.location.href = session_res.data.url;
    }

    function SubscribeButton(){
        const isSubscribed = !!FB_USER?.sub_exp;
        return <Button onClick={attemptSubscription} disabled={isSubscribed} type='default' className="subscribe-btn">
            {isSubscribed ? 'Already subscribed' : 'Subscribe'}
        </Button>;
    };

    function BeforeSubscriptionAttempt(){
        return (
                <div className="subscription-option">
                    <div className="price-text"><span className="price">${price}</span><span className="month-text"> / month</span> </div>
                    <SubscribeButton></SubscribeButton>
                    <div className="subscription-perks-container">
                        <p className="subscription-perks"><CheckOutlined className="subscribe-check-icon"/>Boost your productivity</p>
                        <p className="subscription-perks"><CheckOutlined className="subscribe-check-icon"/>Gain valuable insights into your investments</p>
                        <p className="subscription-perks"><CheckOutlined className="subscribe-check-icon"/><b>3200 credits</b> / month</p>
                    </div>
                </div>)
    }

    function AfterSubscriptionAttempt(){
        return <div id="subscription-message">
            {message}
        </div>
    }

    return <div id="subscription-full">
        <div id="subscription-page">

            <div>
                <div className="subscription-title">Standard</div>
                <div id="subscriptions-container">
                    {message ? AfterSubscriptionAttempt() : BeforeSubscriptionAttempt()}
                </div>
            </div>

        </div>
    </div>
  
}

export default Subscription;