const data = {
    states: require('../model/States.json'),
    setStates: function (data) { this.states = data }
}
const States = require('../model/States');

const getAllStates = async (req, res) => {
    let full = [];
    if(req.query.contig ==='true'){
        const contig = data.states.filter(d => d.code !== 'AK' && d.code !== 'HI');
        for(let i = 0; i < contig.length; i++) {
            const element = contig[i];
            const funfact = await States.findOne({stateCode: element.code}).lean();
            if(funfact){
                const merged = {...element, funfacts: funfact.funfacts};
                full.push(merged);
            }
            else {
                full.push(element);
            }
        }
    }
    else if(req.query.contig === 'false'){
        const nocontig = data.states.filter(d => d.code === 'AK' || d.code === 'HI');
        for(let i = 0; i < nocontig.length; i++) {
            const element = nocontig[i];
            const funfact = await States.findOne({stateCode: element.code}).lean();
            if(funfact){
                const merged = {...element, funfacts: funfact.funfacts};
                full.push(merged);
            }
            else {
                full.push(element);
            }
        }
    }
    else {
        for(let i = 0; i < data.states.length; i++) {
            const element = data.states[i];
            const funfact = await States.findOne({stateCode: element.code}).lean();
            if(funfact){
                const merged = {...element, funfacts: funfact.funfacts};
                full.push(merged);
            }
            else {
                full.push(element);
            }
        }
    }
    
    res.json(full);
}

const getState = async (req, res) => {
    const state = data.states.find(state => state.code === req.params.state.toUpperCase());
    const facts = await States.findOne({ stateCode : req.params.state.toUpperCase()}).exec();
    if(facts){
        const merged = {...state, funfacts: facts.funfacts};
        res.json(merged);
    }
    else{
        res.json(state);
    }
}

const getRandomFact = async (req, res) => {
    const facts = await States.findOne({ stateCode : req.params.state.toUpperCase()}).exec();
    if(facts){
        const fact = facts.funfacts[Math.floor(Math.random() * facts.funfacts.length)];
        const reply = { "funfact":fact};
        res.json(reply);
    }
    else {
        const state = data.states.find(state => state.code === req.params.state.toUpperCase());
        res.json({"message":`No Fun Facts found for ${state.state}`});
    }
}

const getCapital = async (req, res) => {
    const state = data.states.find(state => state.code === req.params.state.toUpperCase());
    const reply = {"state":`${state.state}`,"capital":`${state.capital_city}`}
    res.json(reply);
}

const getNick = async (req, res) => {
    const state = data.states.find(state => state.code === req.params.state.toUpperCase());
    const reply = {"state":`${state.state}`,"nickname":`${state.nickname}`}
    res.json(reply);
}

const getPop = async (req, res) => {
    const state = data.states.find(state => state.code === req.params.state.toUpperCase());
    const reply = {"state":`${state.state}`,"population":`${state.population.toLocaleString("en-US")}`}
    res.json(reply);
}

const getAdmis = async (req, res) => {
    const state = data.states.find(state => state.code === req.params.state.toUpperCase());
    const reply = {"state":`${state.state}`,"admitted":`${state.admission_date}`}
    res.json(reply);
}

const addFunFact = async (req, res) => {
    if (!req?.body?.funfacts) {
        return res.status(400).json({ 'message': 'Fun fact required' });
    }

    if(!Array.isArray(req.body.funfacts)){
        return res.status(400).json({"message": "State fun facts value must be an array"});
    }

    const hasFacts = await States.findOne({ stateCode : req.params.state.toUpperCase()}).exec();

    if(hasFacts){
        req.body.funfacts.forEach(fact => hasFacts.funfacts.push(fact));
        hasFacts.save();
        res.json(hasFacts);
    }
    else {
        try {
            const result = await States.create({
                stateCode: req.params.state.toUpperCase(),
                funfacts: req.body.funfacts
            });
    
            res.status(201).json(result);
        } catch (err) {
            console.error(err);
        }
    }
}

const updateFact = async (req,res) => {
    if (!req?.body?.index) {
        return res.status(400).json({ 'message': "State fun fact index value required" });
    }
    if (!req?.body?.funfact) {
        return res.status(400).json({ 'message': 'Fun fact required' });
    }

    const hasFacts = await States.findOne({ stateCode : req.params.state.toUpperCase()}).exec();

    if(hasFacts){
        const i = req.body.index - 1;
        hasFacts.funfacts[i] = req.body.funfact;
        hasFacts.save();
        res.json(hasFacts);
    }
    else {
        const state = data.states.find(state => state.code === req.params.state.toUpperCase());
        res.json({"message":`No Fun Facts found for ${state.state}`});
    }

}

const deleteFact = async (req,res) => {
    if (!req?.body?.index) {
        return res.status(400).json({ 'message': "State fun fact index value required" });
    }

    const hasFacts = await States.findOne({ stateCode : req.params.state.toUpperCase()}).exec();

    if(hasFacts){
        const i = req.body.index - 1;
        testArray = hasFacts.funfacts.filter(function (element, index) {
            return index != i;
        });
        hasFacts.funfacts = testArray;
        hasFacts.save();
        res.json(hasFacts);
    }
    else {
        const state = data.states.find(state => state.code === req.params.state.toUpperCase());
        res.json({"message":`No Fun Facts found for ${state.state}`});
    }

}

module.exports = {
    getAllStates,
    getState,
    getRandomFact,
    getCapital,
    getNick,
    getPop,
    getAdmis,
    addFunFact,
    updateFact,
    deleteFact
}