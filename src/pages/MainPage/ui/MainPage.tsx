import React, {useState} from "react";
import {Model} from "entities/Model";
import {Button, Input, Modal, Space} from "antd";
import {ParamValue} from "entities/ParamValue";
import {Param} from "entities/Param";
import {DeleteOutlined, SaveOutlined} from "@ant-design/icons";

// Initial values
const modelsInitial: Model[] = [
    {
        paramValues: [
            {paramId: 1, value: "повседневное"},
            {paramId: 2, value: "макси"},
        ]
    }
];

const paramsInitial:Param[] = [
    {id: 1, name: "Назначение", type: 'string'},
    {id: 2, name: "Длина", type: 'string'}
];
// -----

const MainPage = () => {

    // States
    const [models, setModels] = useState<Model[]>(modelsInitial);
    const [params, setParams] = useState<Param[]>(paramsInitial);
    const [isCreateParamModalVisible, setIsCreateParamModalVisible] = useState(false);
    // -----

    // Handlers
    const deleteParamValueHandler = (paramValue: ParamValue) => {
        setModels((oldModels: Model[]) => oldModels.map((m:Model) => ({...m, paramValues: m.paramValues.filter((pv:ParamValue) => pv.paramId !== paramValue.paramId)})));
    };
    const saveParamValueHandler = (paramValue: ParamValue) => {
        setModels((oldModels: Model[]) => oldModels.map((m:Model) => ({...m, paramValues: m.paramValues.map((pv:ParamValue) => {
            if (pv.paramId === paramValue.paramId) return {...pv, value: paramValue.value};
            return pv;
        })})));
    };
    const createParamHandler = (name:string) => {
        setIsCreateParamModalVisible(false); // Закравыем модалку
        let maxId:number = params.reduce((maxId, param) => {
            return param.id > maxId ? param.id : maxId;
        }, params[0].id) + 1; // Вычисляем новый максимальный ИД нового параметра
        let newParam:Param = {
            id: maxId,
            name,
            type: 'string'
        }
        setParams((oldParams:Param[]) => oldParams.concat([newParam]));
        // Исходим из того, что у нас только одна модель товара по заданию для который мы редактируем параметры
        setModels((oldModels: Model[]) => {
            let copy: Model[] = JSON.parse(JSON.stringify(oldModels));
            let newParamValue:ParamValue = {
                paramId: maxId,
                value: "Новое значение"
            }
            copy[0].paramValues.push(newParamValue);
            return copy;
        });
    };
    // -----

    // Components
    const ParamValueRow = (paramValue:ParamValue) => {

        // States
        const [value, setValue] = useState<string>(paramValue.value);
        // -----

        return (
            <Space direction="vertical">
                <Space direction="horizontal">
                    <div style={{width: 140}}>{params.find((param: Param) => param.id === paramValue.paramId)?.name}</div>
                    <Input value={value} onChange={(e) => setValue(e.target.value)} />
                    <Button icon={<SaveOutlined />} onClick={() => saveParamValueHandler({...paramValue, value})}/>
                    <Button danger icon={<DeleteOutlined />} onClick={() => deleteParamValueHandler(paramValue)}/>
                </Space>
            </Space>
        )
    };
    const CreateParamModal = () => {

        //
        const [name, setName] = useState<string>("");
        //

        return (
            <Modal
                title={"Создание нового параметра"}
                okText={"Добавить параметр"}
                onOk={() => createParamHandler(name)}
                onCancel={() => setIsCreateParamModalVisible(false)}
                open={isCreateParamModalVisible}
                width={400}
            >
                <Input placeholder="Введите название" value={name} onChange={(e) => setName(e.target.value)}/>
            </Modal>
        )
    }
    // -----

    return(
        <Space style={{height: window.innerHeight, width: window.innerWidth}} direction="vertical" align="center">
            {isCreateParamModalVisible && <CreateParamModal />}
            <h2>Редактор параметров</h2>
            {models.map((model:Model) => (
                <Space direction="vertical" align="center" style={{background: '#f0f0f0', padding: 15, borderRadius: 10, borderWidth: 1, border: "solid #c2c2c2", width: 400}}>
                    {model.paramValues.map((paramValue:ParamValue) => (<ParamValueRow paramId={paramValue.paramId} value={paramValue.value} />))}
                    <Button onClick={() => setIsCreateParamModalVisible(true)}>Добавить параметр</Button>
                </Space>
            ))}
        </Space>
    )
}
export default MainPage;