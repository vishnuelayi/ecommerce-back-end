import Razorpay from "razorpay";

const instance = new Razorpay({
  key_id: "rzp_test_AzgIH0PE6NUeqn",
  key_secret: "g9Wq3W83WT35jRO6qYTOpuJV",
});

export const checkoutController = async (req, res) => {
  const {amount} = req.body;
  const option = {
    amount: amount * 100,
    currency: "INR",
  };
  const order = await instance.orders.create(option);
  res.json({
    success: true,
    order,
  });
};

export const paymentVerification = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId } = req.body;
  res.json({
    razorpayOrderId,
    razorpayPaymentId,
  });
};
