function FormInput({ label, value, onChange, error, type = "text" }) {
    return (
        <div className="mb-3">
            <label className="form-label fw-bold">{label}</label>
            <input
                type={type}
                className={`form-control ${error ? "is-invalid" : ""}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
}
