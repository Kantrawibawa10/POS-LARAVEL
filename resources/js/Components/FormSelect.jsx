function FormSelect({ label, value, onChange, options, error }) {
    return (
        <div className="mb-3">
            <label className="form-label fw-bold">{label}</label>
            <select
                className={`form-select ${error ? "is-invalid" : ""}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="">Select {label}</option>
                {options.map((item) => (
                    <option key={item.id} value={item.id}>
                        {item.name}
                    </option>
                ))}
            </select>
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
}
