'use client'
import { useState,useEffect } from "react"
const PermissionTableTd = (props) => {
    const [isChecked, setIsChecked] = useState();
    
    useEffect(() => {
            setIsChecked(props.checked);
    }, [props.checked]);

    const onClickCheckbox = async (e) => {
        setIsChecked(e.target.checked);
        await props.modifyPermissionIdArray(e.target.value, e.target.checked);
    }

    return (
        <td key={props.tdKey}>
            <label className="custom-control custom-checkbox">
                <input
                    id="checkbox"
                    type="checkbox"
                    className="custom-control-input"
                    name="permission_id`"
                    defaultValue={props.id}
                    checked={isChecked}
                    onChange={(e) => onClickCheckbox(e)}
                />
                <span className="custom-control-label">
                    &nbsp;
                </span>
            </label>
        </td>
    )
}

export default PermissionTableTd;

