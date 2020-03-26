USE [C84_InternsLA]
GO

/****** Object:  StoredProcedure [dbo].[Openings_Delete_ByID_V2]    Script Date: 3/26/2020 12:11:58 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROC [dbo].[Openings_Delete_ByID_V2] 
			@Id int

AS

/* TEST CODE

DECLARE @_id int = 65

SELECT id,
	   isActive
FROM dbo.Openings
WHERE id = @_id

EXEC [dbo].[Openings_Delete_ByID_V2] @_id 

SELECT id,
	   isActive
FROM dbo.Openings
WHERE id = @_id

*/

BEGIN

UPDATE dbo.Openings
SET IsActive = 0
WHERE id = @Id

END
GO

