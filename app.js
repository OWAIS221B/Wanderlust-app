const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Listing = require('./models/listing.js')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const wrapAsync = require('./utils/wrapAsync.js')

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust'
const port = 8080;
main().then(() => {
    console.log('connected to DB')
}).catch((err) => {
    console.log(err)
})


/////////////   console.log(path.join(__dirname, 'views'), "ghgfgfhgfh")


async function main() {
    await mongoose.connect(MONGO_URL)
}

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, '/public')))

app.get('/', (req, res) => {
    res.send('Hi, i am root')
})


///////////////   Index route


app.get('/listings', async (req, res) => {
    const allListings = await Listing.find({})
    res.render('listings/index.ejs', { allListings })
})

//////////////    New route

app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs')
})

/////////////    Show route 

app.get('/listings/:id', async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    res.render('listings/show.ejs', { listing })
})

////////////     Create route

app.post('/listing', wrapAsync(async (req, res, next) => {

    let listing = req.body.listing
    const newListing = new Listing(listing);
    await newListing.save();
    res.redirect('/listings')


}))

////////////    Edit route

app.get('/listings/:id/edit', async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    res.render('listings/edit.ejs', { listing })
})

////////////////   Update route


app.put('/listings/:id', async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    res.redirect(`/listings/${id}`)
})

///////////////////   Delete route

app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params
    let deleteListing = await Listing.findByIdAndDelete(id)
    console.log(deleteListing)
    res.redirect('/listings')
})

// app.get('/testlisting', async (req, res) => {
//     let sampleListing = new Listing({
//         title: 'My new Villa',
//         description: 'By the beach',
//         price: 1200,
//         location: 'Mitsubi, Hawaii',
//         country: 'USA'
//     })
//     await sampleListing.save()
//     console.log('sample was saved')
//     res.send('successful testing')
// })

app.use((err, req, res, next) => {
    res.send('Something went wrong')
})

app.listen(port, () => {
    console.log('Server is listening to port 8080')
})