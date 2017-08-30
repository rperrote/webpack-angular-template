import { <%= nameM %> } from '../actions/<%= name %>/<%= name %>.actions';

const initialState = [];

export function <%= nameC %>Reducer(state = initialState, action) {
	switch(action.type) {
		<% actions.forEach(function(action){ %>
		case <%=nameM%>.<%=action.name%>:
        	return [...state, ...action.payload];
        <% }) %>

		default:
			return state;
	}
}