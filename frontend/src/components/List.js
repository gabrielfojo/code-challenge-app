import grayThumb from '../images/gray.jpg';

export default function(items){
    const reducer = (acc, item)=>{

        const imageUrl=item.image ? APIURL+'/images/'+item.image : grayThumb ;

        return acc+=`
        <a href="#" data-id="${item._id}" data-type="item" class="list-group-item list-group-item-action ">

          <div class="media">
            <img src="${imageUrl}" class="mr-3" style="max-width:160px" class="img-thumbnail">
            <div class="media-body">
              <h5 class="mt-0">${item.title}</h5>
              <p>${item.text}</p>

              <button type="button" data-type="btn_edit" data-id="${item._id}"class="btn btn-sm btn-info">Edit</button>
              <button type="button" data-type="btn_delete" data-id="${item._id}" class="btn btn-sm btn-info">Delete</button>
            </div>
          </div>


      </a>`
    };
    return items.reduce(reducer, '');
};


