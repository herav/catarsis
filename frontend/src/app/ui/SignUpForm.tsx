import "./SignUpForm.css"

export function SignUpForm(){
    return (
        <form className="form-container" action="">
            <div className="form-group">
                <label htmlFor="userName">User Name</label>
                <input type="text" id="userName" name="userName" placeholder="User Name" /*value={formData.name} onChange={handleChange}*/ required/>
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="email" /*value={formData.email} onChange={handleChange}*/ required/>
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" /*value={formData.password} onChange={handleChange}*/ required/>
            </div>
            <button className="form-btn" type="submit">Sign Up</button>
        </form>    
    )
};


{/* <div class="input-icon">
    <input type="text" id="nombre" name="nombre" placeholder="Ingresa tu nombre" required>
    <i class="fas fa-user"></i>
</div>
<div class="input-icon">
    <input type="email" id="email" name="email" placeholder="Ingresa tu email" required>
    <i class="fas fa-envelope"></i>
</div>
<div class="input-icon">
    <input type="password" id="password" name="password" placeholder="Ingresa tu password" required>
    <i class="fas fa-lock"></i>
</div> */}