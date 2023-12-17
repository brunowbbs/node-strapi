//Stripe CLI
brew install stripe/stripe-cli/stripe

//Login no Stripe local
stripe login

//Listen Stripe
stripe listen --forward-to=http://localhost:3333/webhook
