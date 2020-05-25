export default function(props){
    return `
    <div class="alert alert-danger alert-dismissible " role="alert">
    ${props.msg}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
     </div>
    `;
};