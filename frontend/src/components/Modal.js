import grayThumb from '../images/gray.jpg';

export default function(props){
    const imageUrl=props.modal_image ? props.modal_image : grayThumb ;

    let len = 300-props.modal_text.length;
    let myClass = 'text-success';
    if(len < 50)
        myClass = 'text-danger';
    else if(len < 200)    
        myClass = 'text-warning';

    const remaining=`<small class="${myClass}">${len}</small>`

    return `
    <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <form enctype="multipart/form-data" method="post" name="myModal_form">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="myModal_heading">${props.modal_heading}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
            <div class="form-group">
            <input type="text" data-model="modal_title" value="${props.modal_title}" class="form-control" placeholder="My title" name="title" id="myModal_title">
            </div>
            <div class="form-group">
              <textarea data-model="modal_text"  placeholder="A penny for your thoughts.." class="form-control" name="text" id="myModal_description" rows="5">${props.modal_text}</textarea>
              <p class="text-right p-1 " id="myModal_len">${remaining}</p>
              </div>
            

            <div id="myModal_error"></div>

            <div class="row">
                <div class="col-3">
                 <img id="myModal_thumbnail" src="${imageUrl}" style="width:100px"/>
                </div>
                <div class="col">
                  <input type="file" accept=".jpg,.png,.gif" class="form-control-file" name="image" id="myModal_image">
                </div>
            </div>


            <input type="hidden" id="myModal_id" />


            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <input type="submit" class="btn btn-primary" id="myModal_save" value="Save changes" >
          
        </div>
      </div>
    </div>
    </form>
    
  </div>
    `;

    return items.reduce(reducer, '');
};