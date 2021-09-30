import { Controller } from 'stimulus';
import axios from 'axios';

/*
 * This is an example Stimulus controller!
 *
 * Any element with a data-controller="hello" attribute will cause
 * this controller to be executed. The name "hello" comes from the filename:
 * hello_controller.js -> "hello"
 *
 * Delete this file or adapt it for your use!
 */
export default class extends Controller {
    static targets = ['voteTotal'];
    static values = {
        url: String,
    }

    clickVote(event) {
        event.preventDefault();
        const button = event.currentTarget;

        axios.post(this.urlValue, {
            data: JSON.stringify({ direction: button.value })
        })
            .then((response) => {
                this.voteTotalTarget.innerHTML = response.data.votes;
            })
        ;
    }
}
