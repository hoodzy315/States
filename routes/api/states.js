const express = require('express');
const router = express.Router();
const stateController = require('../../controllers/stateController');
const verifyState = require('../../middleware/verifyState');

router.route('/')
    .get(stateController.getAllStates)

router.route('/:state')
    .get(verifyState(), stateController.getState)

router.route('/:state/funfact')
    .get(verifyState(), stateController.getRandomFact)
    .post(verifyState(), stateController.addFunFact)
    .patch(verifyState(), stateController.updateFact)
    .delete(verifyState(), stateController.deleteFact)

router.route('/:state/capital')
    .get(verifyState(), stateController.getCapital)

router.route('/:state/nickname')
    .get(verifyState(), stateController.getNick)

router.route('/:state/population')
    .get(verifyState(), stateController.getPop)

router.route('/:state/admission')
    .get(verifyState(), stateController.getAdmis)

module.exports = router;