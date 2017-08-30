export const <%= nameM %> = {
<% actions.forEach(function(action) { %>
<%= action.name %>: '<%= action.name %>',
<% }); %>	    
};

<% actions.forEach(function(action) { %>
export function <%= action.nameF %>(){
    return {
        type: <%= nameM %>.<%= action.name %>,
        payload: 
    };
}
<% }); %>