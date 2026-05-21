import { Table, Spin } from "antd";
import {
  createTableauColumns,
  getTableauLocale,
} from "./tableauSuiviHelpers.jsx";

const TableauSuivi = ({ data = [], loading }) => {
  if (loading) {
    return (
      <div className="tableau-suivi-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Table
      dataSource={data}
      columns={createTableauColumns()}
      rowKey="id"
      size="small"
      pagination={{ pageSize: 10, showSizeChanger: true }}
      locale={getTableauLocale()}
      scroll={{ x: 900 }}
      className="tableau-suivi-table"
    />
  );
};

export default TableauSuivi;