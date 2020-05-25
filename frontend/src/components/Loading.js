export default function(){
    let tpl= `
    <div class="d-flex justify-content-center " id="loader">     
    <button class="btn btn-info" type="button" disabled>
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Loading...
    </button>
    </div>
    `;
    return tpl;
};