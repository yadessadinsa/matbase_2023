


        
		const formL = document.getElementById('formL');
        const nname = document.getElementById('name');
        const pwd = document.getElementById('pwd');
        //const sstationT = document.getElementById('sationT')
        //const Prj = documenr.getElementById('Pchoice')
        //const Prj = documenr.getElementById('Pchoice')
        //const Prj = documenr.getElementById('Pchoice')
        //const Prj = documenr.getElementById('Pchoice')
   
        formL.addEventListener('submit', e =>{
   
           e.preventDefault()
           
   
           ValidateInput()
   
        })
   
        const setError = (element, message) => {
   
           const InputControl = element.parentElement;
           const errorDisplay = InputControl.querySelector('.error')
   
           errorDisplay.innerText = message;
           InputControl.classlist.add('error');
           InputControl.classList.remove('success')
        }
   
        const setSuccess = (element) => {
   
        const InputControl = element.parentElement;
        const errorDisplay = InputControl.querySelector('.error')
        
        errorDisplay.innerText = '';
        InputControl.classlist.remove('error');
        InputControl.classList.add('success')
   }
   
        const ValidateInput = () => {
   
           const nameValue = nname.value.trim();
           const pwdValue = pwd.value.trim();
        
   
           if(nameValue === ''){
   
               setError('name', 'Username is required.' )
   
           }else{
               setSuccess('name')
           }
        }
   
   
   
   