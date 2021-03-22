
import {QueryDocListener} from './QueryDocListener';
/**
 * class InputHandler
 *  Implements the required functionality to search for a query via the search button in the eclipse toolbar.
 */


export class InputHandler{
    // Create a listener to handle searches via the editor in ?{querey}? format.
    qdl: QueryDocListener = new QueryDocListener();
};

